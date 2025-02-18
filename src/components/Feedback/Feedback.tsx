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
      comment: "The room was beautiful and the service was excellent. I had a great stay!",
      rating: 5,
      imageUrl: room1,
    },
    {
      name: "Michael Brown",
      comment: "Excellent location and really comfortable rooms. Highly recommended!",
      rating: 4,
      imageUrl: room2,
    },
    {
      name: "Sarah Davis",
      comment: "Loved the spa and the room view was breathtaking. Will come back soon!",
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

  // State for new feedback form
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

  // Container
  const containerStyle: React.CSSProperties = {
    width: "80%",
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "100vh",
    backgroundColor: "#fafafa",
    fontFamily: "Helvetica, Arial, sans-serif",
    padding: "2rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "3rem",
  };

  // Headings
  const headingStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: 700,
    margin: "0 0 1.5rem",
    color: "#333",
    textAlign: "center",
  };

  // Carousel wrapper: 800px wide => 2 items at 400px each
  const carouselWrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "800px",
    margin: "0 auto",
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "1rem 0",
  };

  // Track: each item is 400px wide => totalItems * 400
  const trackStyle: React.CSSProperties = {
    display: "flex",
    transition: "transform 0.4s ease-in-out",
    width: `${400 * totalItems}px`,
    transform: `translateX(-${currentIndex * 800}px)`,
  };

  // Card: 400px wide
  const cardStyle: React.CSSProperties = {
    width: "400px",
    boxSizing: "border-box",
    padding: "2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    backgroundColor: "#fff",
  };

  // Nav buttons
  const navButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    lineHeight: "38px",
    fontSize: "1.2rem",
    userSelect: "none",
  };

  // Form container
  const formContainerStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "700px",
    margin: "0 auto",
  };

  // Labels, inputs, etc.
  const labelStyle: React.CSSProperties = {
    fontSize: "1rem",
    fontWeight: "bold",
    display: "block",
    marginBottom: "0.25rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    outline: "none",
  };

  const submitButtonStyle: React.CSSProperties = {
    background: "linear-gradient(to right, #FF6A9C, #FF3D7F)",
    color: "#fff",
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "opacity 0.3s ease",
    marginTop: "1rem",
    alignSelf: "flex-start",
  };

  // Text wrapping
  const textWrapStyle: React.CSSProperties = {
    whiteSpace: "normal",
    overflowWrap: "break-word",
    wordBreak: "break-word",
    margin: 0,
  };

  return (
    <div style={containerStyle}>
      {/* Carousel Section */}
      <div>
        <h2 style={headingStyle}>Feedback</h2>
        <div style={carouselWrapperStyle}>
          <div style={trackStyle}>
            {feedbackList.map((feedback, index) => (
              <div key={index} style={cardStyle}>
                {/* Image */}
                {feedback.imageUrl && (
                  <div style={{ textAlign: "center" }}>
                    {typeof feedback.imageUrl === "string" ? (
                      <img
                        src={feedback.imageUrl}
                        alt={`${feedback.name} feedback`}
                        style={{
                          width: "250px",
                          height: "250px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <img
                        src={feedback.imageUrl.src}
                        alt={`${feedback.name} feedback`}
                        style={{
                          width: "250px",
                          height: "250px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Comment & Rating */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p style={{ ...textWrapStyle, fontStyle: "italic" }}>
                    “{feedback.comment}”
                  </p>
                  <div>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        style={{
                          color: i < feedback.rating ? "gold" : "lightgray",
                          fontSize: "1.3rem",
                          marginRight: "2px",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p style={{ ...textWrapStyle, textAlign: "right" }}>
                    <strong>- {feedback.name}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <button
            onClick={handlePrev}
            style={{ ...navButtonStyle, left: "1rem" }}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            style={{ ...navButtonStyle, right: "1rem" }}
          >
            →
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div style={formContainerStyle}>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Name */}
          <div>
            <label style={labelStyle}>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Comment */}
          <div>
            <label style={labelStyle}>Write Your Feedback</label>
            <textarea
              placeholder="Write your feedback here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label style={labelStyle}>Upload Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ fontSize: "1rem" }}
            />
          </div>

          {/* Rating */}
          <div>
            <label style={labelStyle}>Rate:</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    cursor: "pointer",
                    color: i < newRating ? "gold" : "gray",
                    fontSize: "1.5rem",
                  }}
                  onClick={() => setNewRating(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={submitButtonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
