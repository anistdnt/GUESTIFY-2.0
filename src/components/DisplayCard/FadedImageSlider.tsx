import Image from "next/image";
import { useEffect, useState } from "react";

type ImageProps = {
  images?: { pg_image_url: string; pg_image_id: string }[];
};

export default function FadedImageSlider({ images }: ImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <Image
        src="/assets/sample1.jpg"
        alt="PG Image"
        className="w-full h-60 object-cover rounded-t-xl"
        width={500}
        height={500}
      />
    );
  }

  return (
    <div className="relative h-60 w-full overflow-hidden rounded-t-xl">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.pg_image_url}
            alt={`PG Image ${idx + 1}`}
            className="w-full h-full object-cover rounded-t-xl"
            width={500}
            height={500}
          />
        </div>
      ))}
    </div>
  );
}