import PGInfoComponent from "@/components/MainPageComponents/PGInfoComponent";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import React from "react";
import { notFound } from "next/navigation";
import toast from "react-hot-toast";
import { PGInfo, Room } from "@/types/pg_type";

interface Iprops {
  params: {
    id: string;
  };
  searchParams : {
    clg_coords?: string;
    clg_name?: string;
    clg_addr?: string;
    clg_pin?: string;
    clg_id?: string;
  };
}

interface PGDetailsResponse {
  pginfo: PGInfo;
  rooms: Room[];
}

export interface Review {
  _id?: string;
  full_name: string;
  feedback: string;
  image_url: string ;
  rating: number
}

const PGDetails = async ({ params: { id },searchParams:{clg_coords, clg_name, clg_addr, clg_pin, clg_id} }: Iprops) => {
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
      <div className="max-w-7xl mx-auto"><PGInfoComponent {...{ pginfo, rooms, reviewData:reviewData?.data, id, clg_coords, clg_name, clg_addr, clg_pin, clg_id }} /></div>
    );
  } catch (error) {
    console.error("Failed to fetch PG details:", error);
    notFound();
  }
};

export default PGDetails;
