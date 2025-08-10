"use client";
import React, { useState, forwardRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDropzone } from "react-dropzone";
import type { StaticImageData } from "next/image";
import { Review } from "@/app/(sharedlayout)/pg/[id]/page";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { base64ToFile } from "@/lib/imageConvert";
import { API } from "@/lib/api_const";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


interface FeedbackItem {
  full_name: string;
  email: string;
  feedback: string;
  rating: number;
  image_url?: string | StaticImageData | File;
}

interface FeedbackProp {
  reviewData: Review[];
  id: string
}

type ReviewSubmitResponseType = {
  success: boolean;
  message: string
}

const Feedback = forwardRef<HTMLDivElement, FeedbackProp>(({ reviewData, id }, ref) => {

  // const feedbackList : Review[] = reviewData;
  const [feedbackList, setFeedbackList] = useState<Review[]>(reviewData)
  const router = useRouter()
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const itemsPerView = 2;
  const totalItems = feedbackList.length;

  const pairsCount = Math.ceil(totalItems / itemsPerView);
  const maxIndex = pairsCount > 0 ? pairsCount - 1 : 0;

  useEffect(()=>{
    setFeedbackList(reviewData)
  },[reviewData])

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      feedback: "",
      rating: 0,
      image_url: ""
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Name is required"),
      email: Yup.string().email("Please enter a valid email id").required("Email is required"),
      feedback: Yup.string().required("Feedback is required"),
      rating: Yup.number().min(1, "Please give a rating")
    }),
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
    }

  });

  async function handleSubmit(values: FeedbackItem) {
    setSubmitLoading(true)

    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    formData.append("feedback", values.feedback);
    formData.append("rating", values.rating.toString());
    if (values.image_url) {
      const file = base64ToFile(values.image_url as string, `Review-Image-${Date.now()}`);
      formData.append("image_url", file); // image as File object
    }

    try {
      const resp = await api_caller<FormData, any>("POST", `${API.REVIEW.ADD_REVIEW}/${id}`, formData);

      if (resp?.success) {
        toast.success(resp.message);
        router.refresh(); // for getting the review list
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Submission failed");
    } finally {
      setSubmitLoading(false)
    }
  }


  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("image_url", reader.result as string);
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
    <div className="w-full mx-auto min-h-screen bg-[#fafafa] py-8 flex flex-col gap-12">
      {/* 1) Carousel Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Feedback
        </h2>

        {/* Carousel Wrapper (800px wide => 2 items at 400px each) */}
        <div className="relative w-full max-w-[800px] mx-auto overflow-hidden bg-white rounded-md shadow p-4">
          {/* Track (dynamic width, translateX) */}
          {feedbackList.length > 0 ?
            (<>
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >

                {feedbackList.map((feedback, index) => (
                  <div
                    key={index}
                    className="w-full lg:w-1/2 shrink-0 box-border p-6 flex flex-col gap-4 bg-white whitespace-normal break-words"
                  >

                    {/* Image (optional) */}
                    <div className="text-center">
                      <img
                        src={feedback.image_url || '/assets/profile.png'}
                        alt={`${feedback.full_name} feedback`}
                        className="w-[250px] h-[250px] object-cover rounded-full mx-auto"
                      />
                    </div>

                    {/* Comment & Rating */}
                    <div className="flex flex-col gap-2">
                      <p className="italic m-0">
                        “{feedback.feedback}”
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
                        - {feedback.full_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

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
            </>) :
            (
              <div className="text-center flex flex-col items-center justify-center gap-4 py-10">
                <img
                  src="/assets/no-feedback.png"
                  alt="No feedback"
                  className="w-[200px] h-[200px] object-contain mx-auto opacity-70"
                />
                <h3 className="text-xl font-semibold text-gray-600">
                  No feedback available
                </h3>
                <p className="text-gray-500 text-sm">
                  Be the first to leave your thoughts. We value your feedback!
                </p>
              </div>
            )}
        </div>
      </div>

      {/* 2) Form Section */}
      <div ref={ref} className="bg-white p-8 rounded-md shadow w-full max-w-[800px] mx-auto scroll-mt-20">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-1">Your Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="full_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.full_name}
              className={`border-2 rounded px-3 py-2 outline-none text-base w-full 
    ${formik.touched.full_name && formik.errors.full_name ? "border-red-500 focus:ring-1 focus:ring-red-400" : "border-gray-300"}`}
            />

            {formik.touched.full_name && formik.errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.full_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-1">Your Email <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`border-2 rounded px-3 py-2 outline-none text-base w-full 
    ${formik.touched.email && formik.errors.email ? "border-red-500 focus:ring-1 focus:ring-red-400" : "border-gray-300"}`}
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.full_name}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold mb-1">Write Your Feedback <span className="text-red-500">*</span></label>
            <textarea
              name="feedback"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.feedback}
              rows={4}
              className={`border-2 rounded px-3 py-2 outline-none text-base w-full resize-none 
    ${formik.touched.feedback && formik.errors.feedback ? "border-red-500 focus:ring-1 focus:ring-red-400" : "border-gray-300"}`}
            />

            {formik.touched.feedback && formik.errors.feedback && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.feedback}</p>
            )}
          </div>

          {/* Dropzone */}
          <div>
            <label className="block text-sm font-bold mb-1">Upload Image (Optional)</label>

            <div
              {...getRootProps()}
              className={`relative inline-block cursor-pointer group border-2 border-dashed rounded-md p-1 
      ${formik.values.image_url ? "border-transparent" : "border-gray-400 hover:border-gray-600"}`}
            >
              <input {...getInputProps()} />

              {formik.values.image_url ? (
                <div className="relative inline-block">
                  <img
                    src={formik.values.image_url}
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
            <label className="block text-sm font-bold mb-1">Rate: <span className="text-red-500">*</span></label>
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
            disabled={submitLoading}
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
