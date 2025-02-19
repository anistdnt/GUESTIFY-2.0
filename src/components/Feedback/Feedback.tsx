"use client";
import React, { useState } from "react";
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

const Feedback: React.FC = () => {
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

  // State for new feedback
  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [newImageBase64, setNewImageBase64] = useState<string>("");

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerView = 2;
  const totalItems = feedbackList.length;

  const pairsCount = Math.ceil(totalItems / itemsPerView);
  const maxIndex = pairsCount > 0 ? pairsCount - 1 : 0;

  // Convert uploaded file to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit new feedback
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newName || !newComment || newRating === 0) {
      alert("Please enter your name, a comment, and a rating.");
      return;
    }

    const newFeedback: FeedbackItem = {
      name: newName,
      comment: newComment,
      rating: newRating,
      imageUrl: newImageBase64 || undefined,
    };

    setFeedbackList((prev) => [...prev, newFeedback]);
    setNewName("");
    setNewComment("");
    setNewRating(0);
    setNewImageBase64("");
  };

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
                        className={`${
                          i < feedback.rating ? "text-gold" : "text-gray-300"
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
      <div className="bg-white p-8 rounded-md shadow w-[700px] mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 outline-none text-base w-full"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Write Your Feedback
            </label>
            <textarea
              placeholder="Write your feedback here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="border border-gray-300 rounded px-3 py-2 outline-none text-base w-full resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Rate:
            </label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  onClick={() => setNewRating(i + 1)}
                  className={`cursor-pointer text-2xl ${
                    i < newRating ? "text-gold" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#FF6A9C] to-[#FF3D7F] text-white py-3 px-6 rounded-full cursor-pointer font-bold text-base uppercase tracking-wide transition-opacity duration-300 mt-4 hover:opacity-80"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
