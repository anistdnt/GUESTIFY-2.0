import PGInfoComponent from "@/components/MainPageComponents/PGInfoComponent";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import React from "react";
import { notFound } from "next/navigation";
import toast from "react-hot-toast";

interface Iprops {
  params: {
    id: string;
  };
}

interface PGDetailsResponse {
  pginfo: PGInfo;
  rooms: Room[];
}

export interface PGInfo {
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  _id: string;
  user_id: string;
  pg_name: string;
  district: string;
  street_name: string;
  house_no: number;
  state: string;
  pincode: number;
  address: string;
  wifi_available: "yes" | "no";
  food_available: "yes" | "no";
  rules: string;
  pg_image_url: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  pg_type: "boys" | "girls" | "unisex";
}

export interface Room {
  _id: string;
  room_type: "single" | "double" | "triple";
  room_image_url: string;
  room_rent: number;
  ac_available: "yes" | "no";
  attached_bathroom: "yes" | "no";
  deposit_duration: "monthly" | "quarterly" | "halfyearly" | "yearly";
  pg_id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Review {
  _id?: string;
  full_name: string;
  feedback: string;
  image_url: string ;
  rating: number
}

const PGDetails = async ({ params: { id } }: Iprops) => {
  try {
    const resData: ApiReturn<PGDetailsResponse> = await api_caller<PGDetailsResponse>(
      "GET",
      `${API.PG.GET_PG_BY_ID}/${id}`
    );

    let reviewData: ApiReturn<Review[]> | null = null;

    if (resData.success && resData.data) {
      reviewData = await api_caller<Review[]>(
        "GET",
        `${API.REVIEW.GET_REVIWS_OF_PG}/${id}`
      );
      if(!reviewData.success){
        toast.error(reviewData?.message)
      }
    }


    if (!resData.success || !resData.data) {
      console.error("API call failed or returned no data:", resData);
      notFound();
    }

    const { pginfo, rooms } = resData.data;

    return (
      <PGInfoComponent {...{ pginfo, rooms, reviewData:reviewData?.data, id }} />
    );
  } catch (error) {
    console.error("Failed to fetch PG details:", error);
    notFound();
  }
};

export default PGDetails;
