"use client";
import { api_caller } from "@/lib/api_caller";
import {
    imageActions,
    imageActionsBtn,
    uploadCell,
    uploadCellBlank,
    uploadedCell,
    uploadImageWrapper,
    actionBlock,
} from "../../app/global_styles";
import {
    PencilSimple,
    Trash,
} from "@phosphor-icons/react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface IProps {
    formik: any;
    imageKey?: string;
}

interface ImageInfo {
    image_url: string,
    public_id: string,
}

const ImagePicker = ({ formik , imageKey }: IProps) => {
    const [images, setImages] = useState<{ [key:string] : string , public_id : string }[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const selectedImageIndex = useRef<number>(-1);

    useEffect(() => {
        if (formik.values.images) {
            setImages(formik.values.images);
        }
    }, [formik.values.images]);

    const onDrop = useCallback(
        async (acceptedFiles: any) => {
            let previousImages = images;
            try {
                const uploadImage = async (file: File) => {
                    const formData = new FormData();
                    formData.append("pg_image_url", file);

                    const headers = {
                        "Content-Type": "multipart/form-data",
                    };

                    const res = await api_caller<ImageInfo>(
                        "POST",
                        "IMAGE_UPLOAD",
                        formData,
                        headers
                    );

                    if (res?.success) {
                        return { [imageKey]: res.data?.image_url, public_id : res.data?.public_id };
                    } else {
                        throw new Error(res?.message || "Image upload failed");
                    }
                };

                let newImages: any[] = [];

                if (selectedImageIndex.current !== -1) {
                    const replacement = await uploadImage(acceptedFiles[0]);
                    if (!replacement) throw new Error("Image upload failed");

                    const payload = { public_id: images[selectedImageIndex.current]?.public_id };
                    const res = await api_caller<any>("POST", "IMAGE_DELETE", payload);

                    if (res?.success) {
                        newImages = previousImages.toSpliced(
                            selectedImageIndex.current,
                            1,
                            replacement
                        );
                    } else {
                        toast.error(res?.message || "Previous image deletion failed");
                        return;
                    }
                } else {
                    const uploadedImages = await Promise.all(
                        acceptedFiles.map((file: File) => uploadImage(file))
                    );

                    newImages = [...previousImages, ...uploadedImages];
                }

                setImages(newImages);
                formik.setFieldValue("images", newImages);

                selectedImageIndex.current = -1;
            } catch (error: any) {
                toast.error(error?.message || "Image upload failed");
                console.error("Error uploading images:", error);
            }
        },
        [images, formik, selectedImageIndex]
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/jpg": [],
            "image/png": [],
        },
        multiple: selectedImageIndex.current === -1,
        maxFiles: selectedImageIndex.current !== -1 ? 1 : undefined,
        onDropAccepted: () => {
            setUploadError(null);
        },
        onDropRejected: (fileRejections) => {
            const rejectedFile = fileRejections[0];
            if (rejectedFile?.file) {
                setUploadError(`File type not allowed: ${rejectedFile.file.type}`);
            } else {
                setUploadError("Unsupported file format.");
            }
        },
    });

    const deleteImage = async (index: number) => {
        const payload = { public_id: images[index]?.public_id };
        const res = await api_caller<any>("POST", "IMAGE_DELETE", payload);

        if (res?.success) {
            const updatedImages = [...images].toSpliced(index, 1);
            setImages(updatedImages);
            formik.setFieldValue("images", updatedImages);
            toast.success(res?.message || "Image deleted successfully");
        } else {
            toast.error(res?.message || "Image deletion failed");
        }
    };

    const editImage = (index: number) => {
        selectedImageIndex.current = index;
        open();
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                    {images &&
                        images.map((img, index) => (
                            <div key={`${index}-${img[imageKey]}`} className="relative">
                                <div className={uploadedCell}>
                                    <Image height={160} width={160} src={img[imageKey]} alt="product" />
                                </div>
                                <div className={`${imageActions} ${imageActions}`}>
                                    <div className="flex gap-3">
                                        <button
                                            className={imageActionsBtn}
                                            onClick={() => editImage(index)}
                                        >
                                            <PencilSimple size={20} color="rgba(255,255,255,.8)" />
                                        </button>
                                        <button
                                            className={imageActionsBtn}
                                            onClick={() => deleteImage(index)}
                                        >
                                            <Trash size={20} color="rgba(255,255,255,.8)" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    <div {...getRootProps()} className={uploadCellBlank}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#5F6368",
                                    lineHeight: 1,
                                    textAlign: "center",
                                }}
                            >
                                Drop the image(s) here
                            </p>
                        ) : (
                            <p
                                style={{
                                    maxWidth: "120px",
                                    fontSize: "14px",
                                    color: "#5F6368",
                                    lineHeight: 1,
                                    textAlign: "center",
                                }}
                            >
                                Drag and drop image or{" "}
                                <span
                                    style={{ cursor: "pointer", color: "#5C79FF" }}
                                    onClick={open}
                                >
                                    browse
                                </span>
                            </p>
                        )}
                    </div>

                    {uploadError && (
                        <p style={{ fontSize: "14px", color: "red", marginTop: "4px" }}>
                            {uploadError}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ImagePicker;
