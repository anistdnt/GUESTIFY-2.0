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
import { API } from "@/lib/api_const";

interface IProps {
    values?: any;
    setFieldValue?: any;
    imageKey?: string;
    room?: any;
    index?: number;
}

interface ImageInfo {
    url: string,
    public_id: string,
}

const ImagePicker = ({ values, setFieldValue, imageKey, room, index }: IProps) => {
    const [images, setImages] = useState<{ [key: string]: string, public_id: string }[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const selectedImageIndex = useRef<number>(-1);

    useEffect(() => {
        if (values?.pg_images && imageKey === "pg_image_url") {
            setImages(values.pg_images.map((img: { pg_image_url: string; pg_image_id: string }) => ({ pg_image_url: img.pg_image_url, public_id: img.pg_image_url })));
        }
        if (room?.room_images && imageKey === "room_image_url") {
            console.log("room images:", room?.room_images);
            setImages(room.room_images.map((img: { room_image_url: string; room_image_id: string }) => ({ room_image_url: img.room_image_url, public_id: img.room_image_url })));
        }
    }, [values?.pg_images, imageKey, room?.room_images]);

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
                        API.IMAGE.UPLOAD,
                        formData,
                        headers
                    );

                    if (res?.success) {
                        return { [imageKey]: res.data?.url, public_id: res.data?.public_id };
                    } else {
                        throw new Error(res?.message || "Image upload failed");
                    }
                };

                let newImages: any[] = [];

                console.log("Selected Image Index:", selectedImageIndex.current);

                if (selectedImageIndex.current !== -1) {
                    const replacement = await uploadImage(acceptedFiles[0]);
                    if (!replacement) throw new Error("Image upload failed");

                    const payload = { public_id: images[selectedImageIndex.current]?.public_id };
                    const res = await api_caller<any>("DELETE", API.IMAGE.DELETE, payload);

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
                imageKey === "pg_image_url" ? setFieldValue("pg_images", newImages.map((img : any)=>{
                    return {pg_image_url: img['pg_image_url'], pg_image_id: img['public_id']}
                })) : setFieldValue(`rooms[${index}].room_images`, newImages.map((img : any)=>{
                    return {room_image_url: img['room_image_url'], room_image_id: img['public_id']}
                }));

                selectedImageIndex.current = -1;
            } catch (error: any) {
                toast.error(error?.message || "Image upload failed");
                console.error("Error uploading images:", error);
            }
        },
        [images, values, selectedImageIndex]
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
        const res = await api_caller<any>("DELETE", API.IMAGE.DELETE, payload);

        if (res?.success) {
            const updatedImages = [...images].toSpliced(index, 1);
            setImages(updatedImages);
            imageKey === "pg_image_url" ? setFieldValue("pg_images", updatedImages) : setFieldValue(`rooms[${index}].room_images`, updatedImages);
            toast.success(res?.message || "Image deleted successfully");
        } else {
            toast.error(res?.message || "Image deletion failed");
        }
    };

    const editImage = (index: number) => {
        selectedImageIndex.current = index;
        console.log("Selected Image Index for Edit:", selectedImageIndex.current);
        setTimeout(() => open(), 0);
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
                                            type="button"
                                            className={imageActionsBtn}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                e.nativeEvent.stopImmediatePropagation();
                                                editImage(index)
                                            }}
                                        >
                                            <PencilSimple size={20} color="rgb(0,0,0)" />
                                        </button>
                                        <button
                                            type="button"
                                            className={imageActionsBtn}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                e.nativeEvent.stopImmediatePropagation();
                                                deleteImage(index)
                                            }}
                                        >
                                            <Trash size={20} color="rgb(0,0,0)" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    <div {...getRootProps({ onClick: (e) => {e.preventDefault(); e.stopPropagation();} })} className={uploadCellBlank}>
                        <input {...getInputProps({
                            type: "file",
                        })} />
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation(); // prevent root re-trigger
                                        open();
                                    }}
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
