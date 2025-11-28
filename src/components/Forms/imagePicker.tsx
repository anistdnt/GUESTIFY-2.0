"use client";
import { api_caller } from "@/lib/api_caller";
import {
    imageActions,
    imageActionsBtn,
    uploadCellBlank,
    uploadedCell,
} from "../../app/global_styles";
import { PencilSimple, Trash, CircleNotch, FilePdf } from "@phosphor-icons/react";
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
    single?: boolean;
}

interface ImageInfo {
    url: string;
    public_id: string;
    loading?: boolean;
    deleting?: boolean;
    editing?: boolean;
}

const ImagePicker = ({ values, setFieldValue, imageKey, room, index, single = false }: IProps) => {
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const selectedImageIndex = useRef<number>(-1);
    const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const isPDF = (url: string) => url?.toLowerCase().endsWith(".pdf");

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
        if(single && imageKey === "image" && values?.image){
            setImages([{ url: values.image, public_id: values.image_id }]);
        }
        if(single && imageKey === "identity_image" && values?.identity_image){
            setImages([{ url: values.identity_image, public_id: values.identity_image_id }]);
        }
    }, [values?.pg_images, imageKey, room?.room_images, values?.image]);

    // Upload function (✅ fixed: skip adding temp preview if editing)
    const uploadImage = async (file: File, isEditing = false) => {
        let tempId: string | null = null;

        if (!isEditing) {
            tempId = `${file.name}-${Date.now()}`;
            setImages((prev) => [
                ...prev,
                { url: URL.createObjectURL(file), public_id: tempId, loading: true },
            ]);
        }

        const formData = new FormData();
        formData.append("image_url", file);

        const headers = { "Content-Type": "multipart/form-data" };

        try {
            const res = await api_caller<ImageInfo>("POST", API.IMAGE.UPLOAD, formData, headers);
            if (res?.success) {
                setUploadError(null);
                if (tempId) {
                    // Replace the temp preview
                    setImages((prev) =>
                        prev.map((img) =>
                            img.public_id === tempId
                                ? { url: res.data?.url, public_id: res.data?.public_id }
                                : img
                        )
                    );
                }
                return { url: res.data?.url, public_id: res.data?.public_id };
            } else {
                throw new Error(res?.message || "Image upload failed");
            }
        } catch (error: any) {
            toast.error(error?.message || "Upload failed");
            setUploadError(error?.message || "Image upload failed");
            if (tempId) {
                setImages((prev) => prev.filter((img) => img.public_id !== tempId));
            }
            return null;
        }
    };

    // On drop
    const onDrop = useCallback(
        async (acceptedFiles: any) => {
            try {
                if (selectedImageIndex.current !== -1) {
                    // ✅ Edit (replace): show spinner only on existing image
                    const idx = selectedImageIndex.current;
                    setImages((prev) =>
                        prev.map((img, i) => (i === idx ? { ...img, editing: true } : img))
                    );

                    const replacement = await uploadImage(acceptedFiles[0], true);
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
                    // Upload new (respect single mode)
                    const filesToUpload = single ? acceptedFiles.slice(0, 1) : acceptedFiles;
                    const uploadedImages = await Promise.all(
                        filesToUpload.map((file: File) => uploadImage(file))
                    );
                    const valid = uploadedImages.filter(Boolean) as ImageInfo[];
                    const newImages = single ? valid : [...images, ...valid];
                    setImages(newImages);
                    updateFormik(newImages);
                }
            } catch (error: any) {
                toast.error(error?.message || "Image upload failed");
                console.error("Error uploading images:", error);
            }
        },
        [images, single]
    );

    // Update Formik
    const updateFormik = (newImages: ImageInfo[]) => {
        if (imageKey === "pg_image_url") {
            setFieldValue(
                "pg_images",
                newImages.map((img) => ({
                    pg_image_url: img.url,
                    pg_image_id: img.public_id,
                }))
            );
        } 
        if (imageKey === "room_image_url") {
            setFieldValue(
                `rooms[${index}].room_images`,
                newImages.map((img) => ({
                    room_image_url: img.url,
                    room_image_id: img.public_id,
                }))
            );
        }
        if (imageKey === "image" && single) {
            setFieldValue(`persons.${index}.image`, newImages[0]?.url || "");
            setFieldValue(`persons.${index}.image_id`, newImages[0]?.public_id || "");
        }
        if (imageKey === "identity_image" && single) {
            setFieldValue( `persons.${index}.identity_image`, newImages[0]?.url || "");
            setFieldValue(`persons.${index}.identity_image_id`, newImages[0]?.public_id || "");
        }
    };

    // Dropzone config
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected: () => {
            setUploadError(["pg_image_url","room_image_url"].includes(imageKey) ? "Only JPG, PNG files are allowed." : "Only JPG, PNG & PDF files are allowed.");
        },
        accept: ["pg_image_url","room_image_url"].includes(imageKey) ? { "image/jpeg": [], "image/jpg": [], "image/png": [] } : { "image/jpeg": [], "image/jpg": [], "image/png": [], "application/pdf": [] },
        multiple: !single && selectedImageIndex.current === -1,
        maxFiles: selectedImageIndex.current !== -1 ? 1 : single ? 1 : undefined,
        noClick: true,
        noKeyboard: true,
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

    // Edit handler
    const editImage = (idx: number) => {
        selectedImageIndex.current = idx;
        const el = fileInputRef.current;
        if (el) {
            el.value = "";
            setTimeout(() => el.click(), 0);
        } else {
            const fallback = document.querySelector('input[type="file"]') as HTMLInputElement | null;
            if (fallback) {
                fallback.value = "";
                setTimeout(() => fallback.click(), 0);
            }
        }
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-md p-6 border border-gray-100 ${
                single ? "max-w-[180px]" : ""
            }`}
        >
            <div className={`flex ${single ? "justify-center" : "flex-wrap gap-6 justify-start"}`}>
                {images.map((img, idx) => {
                    const isProcessing = img.loading || img.deleting || img.editing;

                    return (
                        <div
                            key={`${idx}-${img.url}`}
                            className={`${uploadedCell} group shadow-md w-32 h-32 relative`}
                        >
                            <div className="w-full h-32 flex items-center justify-center bg-white relative">
                                {(isProcessing || !loadedImages[img.public_id]) && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
                                        <CircleNotch
                                            size={32}
                                            weight="bold"
                                            className="text-white animate-spin"
                                        />
                                    </div>
                                )}

                                {isPDF(img.url) ? (
                                    (() => {
                                        if (!loadedImages[img.public_id]) {
                                            setLoadedImages((prev) => ({ ...prev, [img.public_id]: true }));
                                        }
                                        return (
                                            <div className="flex flex-col items-center justify-center gap-1 text-center">
                                                <FilePdf size={38} className="text-red-600" />
                                                {/* <span className="text-xs text-gray-600 max-w-[120px] truncate">
                                                    {img.public_id}.pdf
                                                </span> */}
                                                <button
                                                    type="button"
                                                    onClick={() => window.open(img.url, "_blank")}
                                                    className="text-xs text-indigo-600 underline"
                                                >
                                                    View PDF
                                                </button>
                                            </div>
                                        );
                                    })()
                                ) : (
                                    // ✅ Render Image normally
                                    <Image
                                        src={img.url}
                                        alt="preview"
                                        width={160}
                                        height={160}
                                        className="max-w-full max-h-full object-contain"
                                        onLoadingComplete={() =>
                                            setLoadedImages((prev) => ({
                                                ...prev,
                                                [img.public_id]: true,
                                            }))
                                        }
                                    />
                                )}
                            </div>


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
                                        className={`${imageActionsBtn} ${
                                            images.some((i) => i.deleting)
                                                ? "cursor-not-allowed opacity-50"
                                                : "cursor-pointer"
                                        }`}
                                        disabled={images.some((i) => i.deleting)}
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

                {/* ✅ Dropzone always mounted, hidden when single & has image */}
                <div
                    {...getRootProps({
                        onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        },
                    })}
                    className={`${uploadCellBlank} w-32 h-32 ${
                        single && images.length > 0 ? "hidden" : ""
                    }`}
                >
                    <input {...getInputProps({ type: "file" })} ref={fileInputRef} />
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
                                    const el = fileInputRef.current;
                                    if (el) {
                                        el.value = "";
                                        el.click();
                                    }
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