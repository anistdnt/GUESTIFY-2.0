"use client";
import React, { useState, forwardRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import type { StaticImageData } from "next/image";
import room1 from "../../../public/assets/rooms/room1.jpg";
import room2 from "../../../public/assets/rooms/room2.jpg";
import room3 from "../../../public/assets/rooms/room3.jpg";
import room4 from "../../../public/assets/rooms/room4.jpg";
import room5 from "../../../public/assets/rooms/room5.jpg";
import room6 from "../../../public/assets/rooms/room6.jpg";

interface FeedbackItem {
  name: string;
  comment: string;
  rating: number;
  imageUrl?: string | StaticImageData;
}

const Feedback = forwardRef<HTMLDivElement>((_, ref) => {
  // Default feedback items
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    {
      name: "Emma Johnson",
      comment:
        "The room was beautiful and the service was excellent. I had a great stay!",
      rating: 5,
      imageUrl: room1,
    },
    {
      name: "Michael Brown",
      comment:
        "Excellent location and really comfortable rooms. Highly recommended!",
      rating: 4,
      imageUrl: room2,
    },
    {
      name: "Sarah Davis",
      comment:
        "Loved the spa and the room view was breathtaking. Will come back soon!",
      rating: 4,
      imageUrl: room3,
    },
    {
      name: "David Lee",
      comment: "The staff was very friendly and helpful. The breakfast was also delicious!",
      rating: 5,
      imageUrl: room4,
    },
    {
      name: "Emily Chen",
      comment: "The room was clean and cozy. The location was also very convenient.",
      rating: 4,
      imageUrl: room5,
    },
    {
      name: "James Wilson",
      comment: "The hotel had a great atmosphere and the amenities were top-notch.",
      rating: 5,
      imageUrl: room6,
    },
  ]);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerView = 2;
  const totalItems = feedbackList.length;

  const pairsCount = Math.ceil(totalItems / itemsPerView);
  const maxIndex = pairsCount > 0 ? pairsCount - 1 : 0;

  const formik = useFormik({
    initialValues: {
      name: "",
      comment: "",
      rating: 0,
      imageUrl: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      comment: Yup.string().required("Feedback is required"),
      rating: Yup.number().min(1, "Please give a rating")
    }),
    onSubmit: (values, { resetForm }) => {
      const newFeedback: FeedbackItem = {
        name: values.name,
        comment: values.comment,
        rating: values.rating,
        imageUrl: values.imageUrl || undefined
      };
      setFeedbackList((prev) => [...prev, newFeedback]);
      resetForm();
    }

  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  });

  // Infinite Carousel Navigation
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  return (
    <div className="w-4/5 max-w-[1200px] mx-auto min-h-screen bg-[#fafafa] py-8 flex flex-col gap-12">
      {/* 1) Carousel Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Feedback
        </h2>

        {/* Carousel Wrapper (800px wide => 2 items at 400px each) */}
        <div className="relative w-[800px] mx-auto overflow-hidden bg-white rounded-md shadow p-4">
          {/* Track (dynamic width, translateX) */}
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              width: `${400 * totalItems}px`,
              transform: `translateX(-${currentIndex * 800}px)`,
            }}
          >
            {feedbackList.map((feedback, index) => (
              <div
                key={index}
                className="w-[400px] box-border p-6 flex flex-col gap-4 bg-white whitespace-normal break-words"
              >
                {/* Image (optional) */}
                {feedback.imageUrl && (
                  <div className="text-center">
                    {typeof feedback.imageUrl === "string" ? (
                      <img
                        src={feedback.imageUrl}
                        alt={`${feedback.name} feedback`}
                        className="w-[250px] h-[250px] object-cover rounded-full mx-auto"
                      />
                    ) : (
                      <img
                        src={feedback.imageUrl.src}
                        alt={`${feedback.name} feedback`}
                        className="w-[250px] h-[250px] object-cover rounded-full mx-auto"
                      />
                    )}
                  </div>
                )}

                {/* Comment & Rating */}
                <div className="flex flex-col gap-2">
                  <p className="italic m-0">
                    “{feedback.comment}”
                  </p>
                  <div>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`${i < feedback.rating ? "text-buttons" : "text-gray-300"
                          } text-xl mr-[2px]`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-right m-0 font-semibold">
                    - {feedback.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 left-4 bg-white border border-gray-300 rounded-full w-10 h-10 cursor-pointer font-bold shadow text-center leading-[2.5rem] text-xl select-none"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 right-4 bg-white border border-gray-300 rounded-full w-10 h-10 cursor-pointer font-bold shadow text-center leading-[2.5rem] text-xl select-none"
          >
            →
          </button>
        </div>
      </div>

      {/* 2) Form Section */}
      <div ref={ref} className="bg-white p-8 rounded-md shadow w-full max-w-[800px] mx-auto scroll-mt-20">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`border-2 rounded px-3 py-2 outline-none text-base w-full 
    ${formik.touched.name && formik.errors.name ? "border-red-500 focus:ring-1 focus:ring-red-400" : "border-gray-300"}`}
            />

            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold mb-1">Write Your Feedback</label>
            <textarea
              name="comment"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.comment}
              rows={4}
              className={`border-2 rounded px-3 py-2 outline-none text-base w-full resize-none 
    ${formik.touched.comment && formik.errors.comment ? "border-red-500 focus:ring-1 focus:ring-red-400" : "border-gray-300"}`}
            />

            {formik.touched.comment && formik.errors.comment && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.comment}</p>
            )}
          </div>

          {/* Dropzone */}
          <div>
            <label className="block text-sm font-bold mb-1">Upload Image (Optional)</label>

            <div
              {...getRootProps()}
              className={`relative inline-block cursor-pointer group border-2 border-dashed rounded-md p-1 
      ${formik.values.imageUrl ? "border-transparent" : "border-gray-400 hover:border-gray-600"}`}
            >
              <input {...getInputProps()} />

              {formik.values.imageUrl ? (
                <div className="relative inline-block">
                  <img
                    src={formik.values.imageUrl}
                    alt="Uploaded preview"
                    className="max-w-[300px] max-h-[300px] object-contain rounded-md"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      className="bg-black bg-opacity-50 text-white font-semibold px-4 py-2 rounded shadow"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <p className="text-center text-sm text-gray-500">Drag & drop or click to upload</p>
                </div>
              )}
            </div>
          </div>




          {/* Rating */}
          <div>
            <label className="block text-sm font-bold mb-1">Rate:</label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  onClick={() => formik.setFieldValue("rating", i + 1)}
                  className={`cursor-pointer hover:scale-110 transition-transform duration-150 text-3xl ${i < formik.values.rating ? "text-buttons" : "text-gray-300"
                    }`}
                >
                  ★
                </span>
              ))}
            </div>
            {formik.touched.rating && formik.errors.rating && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.rating}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-gradient-to-r from-buttonsSecondary to-buttons text-white py-3 px-6 rounded-full cursor-pointer font-bold text-base uppercase tracking-wide transition-opacity duration-300 mt-4 hover:opacity-80"
          >
            Submit Feedback
          </button>
        </form>
      </div>

    </div>
  );
});

Feedback.displayName = "Feedback";

export default Feedback;
