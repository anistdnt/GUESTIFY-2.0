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
import { Star, CaretLeft, CaretRight, ChatTeardropText, PaperPlaneTilt, ImageSquare, Quotes } from "@phosphor-icons/react";
import CommonButton from "../AppComponents/CommonButton";
import Image from "next/image";


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
    <div className="w-full mx-auto py-12 flex flex-col gap-24 font-jakarta">
      {/* 1) Editorial Carousel Section */}
      <div className="w-full">
        <div className="relative w-full max-w-6xl mx-auto px-4 group/carousel">
          {feedbackList.length > 0 ? (
            <>
              {/* Navigation Controls */}
              <div className="absolute inset-y-0 -left-4 -right-4 flex items-center justify-between pointer-events-none z-30">
                <button
                  onClick={handlePrev}
                  className="pointer-events-auto p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-100 shadow-xl text-gray-900 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:scale-110 active:scale-95 opacity-0 md:group-hover/carousel:opacity-100"
                >
                  <CaretLeft size={24} weight="bold" />
                </button>
                <button
                  onClick={handleNext}
                  className="pointer-events-auto p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-100 shadow-xl text-gray-900 transition-all duration-300 hover:bg-primary-600 hover:text-white hover:scale-110 active:scale-95 opacity-0 md:group-hover/carousel:opacity-100"
                >
                  <CaretRight size={24} weight="bold" />
                </button>
              </div>

              <div className="overflow-hidden rounded-[3rem]">
                <div
                  className="flex transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {/* Sliding in pairs for desktop, singles for mobile */}
                  {Array.from({ length: pairsCount }).map((_, pIdx) => (
                    <div key={pIdx} className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
                      {feedbackList.slice(pIdx * itemsPerView, (pIdx + 1) * itemsPerView).map((feedback, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col gap-8 relative overflow-hidden group/card"
                        >
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover/card:rotate-0 transition-transform duration-700">
                            <Quotes size={80} weight="fill" className="text-primary-600" />
                          </div>

                          <div className="flex items-center gap-5">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                              <Image
                                src={(feedback.image_url as string) || '/assets/profile.png'}
                                alt={feedback.full_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900 font-display tracking-tight leading-none mb-2">
                                {feedback.full_name}
                              </h4>
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    weight={i < feedback.rating ? "fill" : "regular"}
                                    className={i < feedback.rating ? "text-primary-500" : "text-gray-200"}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <blockquote className="relative z-10">
                            <p className="text-gray-600 leading-relaxed italic font-jakarta text-[1.05rem]">
                              “{feedback.feedback}”
                            </p>
                          </blockquote>

                          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600/60">Verified Resident</span>
                            <div className="flex items-center gap-1.5 bg-primary-50 px-3 py-1 rounded-full">
                              <Star size={12} weight="fill" className="text-primary-600" />
                              <span className="text-[10px] font-bold text-primary-700">{feedback.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-3 mt-10">
                {Array.from({ length: pairsCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === i ? "w-10 bg-primary-600" : "w-2 bg-gray-200"}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 shadow-sm border border-gray-50 text-center flex flex-col items-center gap-6">
              <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center mb-4">
                <ChatTeardropText size={48} weight="duotone" className="text-primary-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900 font-display tracking-tight">
                  No <span className="italic-serif text-primary-600">Feedback</span> Yet
                </h3>
                <p className="text-gray-400 font-jakarta max-w-sm">Be the first to share your experience and help fellow students find their perfect home.</p>
              </div>
              <CommonButton 
                variant="primary"
                size="lg"
                onClick={() => ref && (ref as any).current?.scrollIntoView({ behavior: 'smooth' })}
              >
                Share Your Thoughts
              </CommonButton>
            </div>
          )}
        </div>
      </div>

      {/* 2) Premium Form Section */}
      <div ref={ref} className="w-full max-w-4xl mx-auto px-4 scroll-mt-32">
        <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-[0_30px_70px_rgba(0,0,0,0.04)] border border-gray-50 relative overflow-hidden group/form">
          {/* Decorative Gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-30" />

          <div className="relative z-10 flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 bg-primary-50 px-4 py-1.5 rounded-full">
              <PaperPlaneTilt size={16} weight="bold" className="text-primary-600" />
              <span className="text-[10px] font-bold text-primary-700 tracking-widest uppercase">Share Your Story</span>
            </div>
            <h2 className="text-4xl font-semibold text-gray-900 font-display tracking-tight mb-4">
              Leave a <span className="italic-serif text-primary-600">Review</span>
            </h2>
            <p className="text-gray-400 font-jakarta max-w-lg leading-relaxed">Your honest insights help us build a better living community for everyone.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Name */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="e.g. Aditi Sharma"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.full_name}
                  className={`w-full bg-gray-50/50 border-2 rounded-[1.25rem] px-6 py-4 outline-none text-base font-jakarta transition-all duration-300
                    ${formik.touched.full_name && formik.errors.full_name ? "border-red-100 focus:border-red-400 bg-red-50/20" : "border-transparent focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-600/5 hover:bg-gray-50"}`}
                />
                {formik.touched.full_name && formik.errors.full_name && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{formik.errors.full_name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="aditi@example.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full bg-gray-50/50 border-2 rounded-[1.25rem] px-6 py-4 outline-none text-base font-jakarta transition-all duration-300
                    ${formik.touched.email && formik.errors.email ? "border-red-100 focus:border-red-400 bg-red-50/20" : "border-transparent focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-600/5 hover:bg-gray-50"}`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{formik.errors.email}</p>
                )}
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Experience</label>
              <textarea
                name="feedback"
                placeholder="What was it like living here? Mention the vibes, amenities, or staff!"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.feedback}
                rows={5}
                className={`w-full bg-gray-50/50 border-2 rounded-[1.5rem] px-6 py-4 outline-none text-base font-jakarta transition-all duration-300 resize-none
                  ${formik.touched.feedback && formik.errors.feedback ? "border-red-100 focus:border-red-400 bg-red-50/20" : "border-transparent focus:border-primary-400 focus:bg-white focus:shadow-lg focus:shadow-primary-600/5 hover:bg-gray-50"}`}
              />
              {formik.touched.feedback && formik.errors.feedback && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{formik.errors.feedback}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
              {/* Dropzone Enhanced */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Property Visual (Optional)</label>
                <div
                  {...getRootProps()}
                  className={`relative group cursor-pointer border-2 border-dashed bg-gray-50/50 rounded-[2rem] p-4 transition-all duration-500
                    ${formik.values.image_url ? "border-transparent ring-4 ring-primary-50 ring-offset-4 bg-white" : "border-gray-200 hover:border-primary-400 hover:bg-white hover:shadow-xl hover:shadow-primary-600/5"}`}
                >
                  <input {...getInputProps()} />
                  {formik.values.image_url ? (
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                      <Image
                        src={formik.values.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 gap-2">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary-600 transition-colors">
                        <ImageSquare size={24} weight="duotone" />
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Photo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating Enhanced */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-center md:text-left block">Resident Rating</label>
                <div className="bg-gray-50/50 p-6 rounded-[2rem] flex flex-col items-center gap-4 border border-transparent transition-all hover:bg-white hover:border-gray-100">
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => formik.setFieldValue("rating", i + 1)}
                        className="transition-all duration-300 hover:scale-125 focus:outline-none"
                      >
                        <Star
                          size={32}
                          weight={i < formik.values.rating ? "fill" : "regular"}
                          className={i < formik.values.rating ? "text-primary-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                    {formik.values.rating > 0 ? `${formik.values.rating}.0 / 5.0 Rating` : "Select Stars"}
                  </span>
                </div>
                {formik.touched.rating && formik.errors.rating && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider text-center md:text-left">{formik.errors.rating}</p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 flex justify-center">
              <CommonButton
                variant="primary"
                size="lg"
                disabled={submitLoading}
                className="w-full md:w-auto min-w-[280px] h-[60px] text-lg rounded-2xl shadow-2xl shadow-primary-600/20"
                {...formik.handleSubmit}
              >
                {submitLoading ? "Submitting..." : "Publish Review"}
              </CommonButton>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
});

Feedback.displayName = "Feedback";

export default Feedback;
