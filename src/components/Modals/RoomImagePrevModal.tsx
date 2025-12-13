"use client";

import { X } from "@phosphor-icons/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

type Props = {
  setshowModal: (show: boolean) => void;
  modalData: {
    images: {
      room_image_url: string;
      room_image_id: string;
      _id?: string;
    }[];
  };
};

export default function RoomImagePrevModal({
  setshowModal,
  modalData,
}: Props) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md room-image-modal">
      {/* Close Button */}
      <button
        onClick={() => setshowModal(false)}
        className="absolute top-4 right-4 z-50 text-white hover:text-gray-300"
      >
        <X size={32} />
      </button>

      {/* Image Slider */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop
        className="w-screen h-screen"
      >
        {modalData.images.map((img, idx) => (
          <SwiperSlide key={img.room_image_id || idx}>
            <div className="relative w-screen h-screen">
              <Image
                src={img.room_image_url}
                alt={`Room image ${idx + 1}`}
                fill
                priority
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
