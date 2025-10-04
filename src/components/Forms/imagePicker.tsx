"use client";
import { api_caller } from "@/lib/api_caller";
import {
    imageActions,
    imageActionsBtn,
    uploadCellBlank,
    uploadedCell,
} from "../../app/global_styles";
import { PencilSimple, Trash, CircleNotch } from "@phosphor-icons/react";
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
    url: string;
    public_id: string;
    loading?: boolean;
    deleting?: boolean;
    editing?: boolean;
}

const ImagePicker = ({ values, setFieldValue, imageKey, room, index }: IProps) => {
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const selectedImageIndex = useRef<number>(-1);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});

    // Load existing images
    useEffect(() => {
        if (values?.pg_images && imageKey === "pg_image_url") {
            setImages(
                values.pg_images.map(
                    (img: { pg_image_url: string; pg_image_id: string }) => ({
                        url: img.pg_image_url,
                        public_id: img.pg_image_id,
                    })
                )
            );
        }
        if (room?.room_images && imageKey === "room_image_url") {
            setImages(
                room.room_images.map(
                    (img: { room_image_url: string; room_image_id: string }) => ({
                        url: img.room_image_url,
                        public_id: img.room_image_id,
                    })
                )
            );
        }
    }, [values?.pg_images, imageKey, room?.room_images]);

    // Upload function
    const uploadImage = async (file: File) => {
        const tempId = `${file.name}-${Date.now()}`;
        setImages((prev) => [...prev, { url: URL.createObjectURL(file), public_id: tempId, loading: true }]);

        const formData = new FormData();
        formData.append("pg_image_url", file);

        const headers = { "Content-Type": "multipart/form-data" };

        try {
            const res = await api_caller<ImageInfo>("POST", API.IMAGE.UPLOAD, formData, headers);
            if (res?.success) {
                setImages((prev) =>
                    prev.map((img) =>
                        img.public_id === tempId
                            ? { url: res.data?.url, public_id: res.data?.public_id }
                            : img
                    )
                );
                return { url: res.data?.url, public_id: res.data?.public_id };
            } else {
                throw new Error(res?.message || "Image upload failed");
            }
        } catch (error: any) {
            toast.error(error?.message || "Upload failed");
            setImages((prev) => prev.filter((img) => img.public_id !== tempId));
            return null;
        }
    };

    // On drop
    const onDrop = useCallback(
        async (acceptedFiles: any) => {
            try {
                if (selectedImageIndex.current !== -1) {
                    // Edit (replace)
                    const idx = selectedImageIndex.current;
                    setImages((prev) =>
                        prev.map((img, i) => (i === idx ? { ...img, editing: true } : img))
                    );

                    const replacement = await uploadImage(acceptedFiles[0]);
                    if (!replacement) return;

                    const payload = { public_id: images[idx]?.public_id };
                    const res = await api_caller<any>("DELETE", API.IMAGE.DELETE, payload);

                    if (res?.success) {
                        const newImages = images.toSpliced(idx, 1, replacement);
                        setImages(newImages);
                        updateFormik(newImages);
                        toast.success("Image replaced successfully");
                    } else {
                        toast.error(res?.message || "Previous image deletion failed");
                    }

                    setImages((prev) =>
                        prev.map((img, i) => (i === idx ? { ...img, editing: false } : img))
                    );
                    selectedImageIndex.current = -1;
                } else {
                    // Upload new
                    const uploadedImages = await Promise.all(
                        acceptedFiles.map((file: File) => uploadImage(file))
                    );
                    const valid = uploadedImages.filter(Boolean) as ImageInfo[];
                    const newImages = [...images, ...valid];
                    setImages(newImages);
                    updateFormik(newImages);
                }
            } catch (error: any) {
                toast.error(error?.message || "Image upload failed");
                console.error("Error uploading images:", error);
            }
        },
        [images]
    );

    // Update Formik state helper
    const updateFormik = (newImages: ImageInfo[]) => {
        if (imageKey === "pg_image_url") {
            setFieldValue(
                "pg_images",
                newImages.map((img) => ({
                    pg_image_url: img.url,
                    pg_image_id: img.public_id,
                }))
            );
        } else {
            setFieldValue(
                `rooms[${index}].room_images`,
                newImages.map((img) => ({
                    room_image_url: img.url,
                    room_image_id: img.public_id,
                }))
            );
        }
    };

    // Dropzone config
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [], "image/jpg": [], "image/png": [] },
        multiple: selectedImageIndex.current === -1,
        maxFiles: selectedImageIndex.current !== -1 ? 1 : undefined,
    });

    // Delete function
    const deleteImage = async (idx: number) => {
        setImages((prev) =>
            prev.map((img, i) => (i === idx ? { ...img, deleting: true } : img))
        );

        const payload = { public_id: images[idx]?.public_id };
        const res = await api_caller<any>("DELETE", API.IMAGE.DELETE, payload);

        if (res?.success) {
            const updatedImages = images.toSpliced(idx, 1);
            setImages(updatedImages);
            updateFormik(updatedImages);
            toast.success("Image deleted successfully");
        } else {
            toast.error(res?.message || "Image deletion failed");
            setImages((prev) =>
                prev.map((img, i) => (i === idx ? { ...img, deleting: false } : img))
            );
        }
    };

    const editImage = (idx: number) => {
        selectedImageIndex.current = idx;
        setTimeout(() => open(), 0);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex flex-wrap gap-6 justify-start">
                {images.map((img, idx) => {
                    const isProcessing = img.loading || img.deleting || img.editing;

                    return (
                        <div key={`${idx}-${img.url}`} className={`${uploadedCell} group shadow-md w-32 h-32 relative`}>
                            <div className="w-full h-32 flex items-center justify-center bg-white relative">
                                {/* Loader overlay while processing OR image not loaded */}
                                {(isProcessing || !loadedImages[img.public_id]) && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                                        <CircleNotch size={32} weight="bold" className="text-white animate-spin" />
                                    </div>
                                )}

                                <Image
                                    src={img.url}
                                    alt="product"
                                    width={160}
                                    height={160}
                                    className="max-w-full max-h-full object-contain"
                                    onLoadingComplete={() =>
                                        setLoadedImages((prev) => ({ ...prev, [img.public_id]: true }))
                                    }
                                />
                            </div>

                            {/* Actions (only when not processing) */}
                            {!isProcessing && loadedImages[img.public_id] && (
                                <div className={`${imageActions}`}>
                                    <button
                                        type="button"
                                        className={`${imageActionsBtn}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            editImage(idx);
                                        }}
                                    >
                                        <PencilSimple size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        className={`${imageActionsBtn}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            deleteImage(idx);
                                        }}
                                    >
                                        <Trash size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}


                {/* Upload cell */}
                <div
                    {...getRootProps({
                        onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                    })}
                    className={`${uploadCellBlank} w-32 h-32`}
                >
                    <input {...getInputProps({ type: "file" })} />
                    {isDragActive ? (
                        <p className="text-sm text-gray-500 text-center">Drop image(s) here</p>
                    ) : (
                        <p className="max-w-[120px] text-sm text-gray-500 text-center">
                            Drag & drop or{" "}
                            <span
                                className="cursor-pointer text-indigo-500"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    open();
                                }}
                            >
                                browse
                            </span>
                        </p>
                    )}
                </div>
            </div>

            {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
        </div>
    );
};

export default ImagePicker;
