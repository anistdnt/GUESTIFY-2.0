"use client";

import React, { useEffect, useState } from "react";
import DisplayCard from "@/components/DisplayCard/DisplayCard";
import { useSearchParams } from "next/navigation";
import { api_caller, ApiReturn } from "@/lib/api_caller";
import toast from "react-hot-toast";
import { API } from "@/lib/api_const";
import NoDataFound from "../NoDataFound/NoDataFound";
import { CardSkeleton } from "../Loader/CardSkeleton";

export default function CardSection() {
  const query = useSearchParams();

  const [cards, setCards] = useState<any>(null);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (query.size !== 0) {
      let queryArray = [];

      if (query.get("kmradi")) {
        queryArray?.push(`kmradi=${query.get("kmradi")}`);
      } else {
        queryArray?.push("kmradi=10");
      }

      if (query.get("coordinates")) {
        queryArray?.push(`coordinates=${query.get("coordinates")}`);
      }

      if(query.get("sort")){
        queryArray?.push(`sort=${query.get("sort")}`);
      }

      // if(query.get("college")){
      //     urlquery = urlquery + `college=${query.get("college")}`;
      // }

      const urlquery = queryArray?.join("&");

      const fetchPgs = async (searchQuery: string) => {
        setloading(true);
        const res: ApiReturn<any> = await api_caller<any>(
          "GET",
          `${API.PG.ALL}?${searchQuery}`
        );
        if (res.success) {
          setCards(res?.data);
        } else {
          toast.error(`${res.message} : ${res.error}`);
          setCards([]);
        }
        setloading(false);
      };

      fetchPgs(urlquery);
    }
  }, [query]);

  if (query.size === 0) {
    return null;
  }

  if (loading) {
    return <CardSkeleton no_of_card={2} />;
  } else if (!cards || cards?.length === 0) {
    return (
      <div className="w-full py-10">
        <NoDataFound text="No Paying Guest Home Found" />
      </div>
    );
  } else {
    return (
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 py-10 px-3 justify-items-center">
        {cards?.map((item: any, index: number) => (
          <div key={index}>
            <DisplayCard item={item} number_of_stars={5} />
          </div>
        ))}
      </div>
    );
  }
}
