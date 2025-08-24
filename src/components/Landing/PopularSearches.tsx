import { api_caller, ApiReturn } from "@/lib/api_caller";
import { API } from "@/lib/api_const";
import { CollegeType } from "@/types/college";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

export default async function PopularSearches() {
  try {
    const resData: ApiReturn<any> = await api_caller<any>(
      "GET",
      `${API.COLLEGE.LIST}?popular=true`
    );

    if (resData.success && resData.data) {
      const colleges = resData.data.colleges;
      return (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-cardTitleCol mb-6">
            Popular Colleges
          </h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {colleges?.map((college: CollegeType, index: number) => (
              <Link
                key={index}
                href={`/search?coordinates=${college.location?.coordinates?.join(
                  ","
                )}&clg_name=${college?.college_name}&clg_addr=${
                  college?.address
                }&clg_pin=${college?.pincode}&clg_id=${college?._id}`}
                className="bg-cardsBackground hover:bg-buttons text-cardTitleCol hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md border border-buttons/20 hover:border-buttons"
              >
                {college?.college_name}
              </Link>
            ))}
          </div>
        </div>
      );
    } else {
      console.error("API call failed or returned no data:", resData);
      toast.error("Error While Loading Popular College Section");
    }
  } catch (error) {
    console.error("Failed to fetch College details:", error);
    toast.error("Error While Loading Popular College Section");
  }
}
