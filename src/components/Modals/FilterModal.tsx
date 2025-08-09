import { X } from "@phosphor-icons/react/dist/ssr";
import React, {  useEffect, useState } from "react";
import Select from "react-select";
import { RangeSlider } from "../Searchbar/Filter/RangeSlider";
import { useRouter, useSearchParams } from "next/navigation";

type ModalType = {
  setshowModal: (show: boolean) => void;
};

type FilterFormDataType = {
  minRent?: number;
  maxRent?: number;
  pg_type?: string;
  wifi_available?: string;
  food_available?: string;
};

function FilterModal({ setshowModal }: ModalType) {
  const query = useSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState<FilterFormDataType>({
    minRent: Number(query.get("minRent")) || 2000,
    maxRent: Number(query.get("maxRent")) || 10000,
    pg_type: query.get("pg_type") || "",
    wifi_available: query.get("wifi_available") || "no",
    food_available: query.get("food_available") || "no",
  });
  const [values, setValues] = useState<number[]>([
    formData?.minRent,
    formData?.maxRent,
  ]);

  {
    /* Add this extra state for enabling/disabling filters */
  }
  const [enabledFilters, setEnabledFilters] = useState({
    pg_type: query.has("pg_type"),
    rent: query.has("minRent") || query.has("maxRent"),
    wifi_available: query.has("wifi_available"),
    food_available: query.has("food_available"),
  });

  function toggleFilterEnable(key: keyof typeof enabledFilters) {
    setEnabledFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  useEffect(() => {
    setFormData({
      ...formData,
      minRent: values[0],
      maxRent: values[1],
    });
  }, [values]);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(query.toString());
    if (enabledFilters.rent) {
      params.set("minRent", formData.minRent?.toString());
      params.set("maxRent", formData.maxRent?.toString());
    } else {
      params.delete("minRent");
      params.delete("maxRent");
    }
    if (enabledFilters.pg_type) {
      params.set("pg_type", formData.pg_type);
    } else {
      params.delete("pg_type");
    }
    if (enabledFilters.wifi_available) {
      params.set("wifi_available", formData.wifi_available);
    } else {
      params.delete("wifi_available");
    }
    if (enabledFilters.food_available) {
      params.set("food_available", formData.food_available);
    } else {
      params.delete("food_available");
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/search${newUrl}`, { scroll: false });
    setshowModal(false);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-10"
      onClick={() => setshowModal(false)}
    >
      <div
        className="relative flex flex-col gap-3 bg-white p-6 mx-2 rounded-md shadow-lg w-1/3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center">
          <h3 className="text-xl">Additional Filters</h3>
          <button
            onClick={() => {
              setshowModal(false);
            }}
          >
            <X size={20} />
          </button>
        </div>
        <hr />
        <form onSubmit={handleApplyFilters} className="flex flex-col gap-4">
          {/* Row 1 — PG Type */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="w-4 h-4 bg-buttons cursor-pointer rounded"
                checked={enabledFilters.pg_type}
                onChange={() => toggleFilterEnable("pg_type")}
              />
              <label className="text-gray-700 font-medium">PG Type</label>
            </div>
            <Select
              isDisabled={!enabledFilters.pg_type}
              options={[
                { label: "BOYS", value: "boys" },
                { label: "GIRLS", value: "girls" },
              ]}
              value={
                formData.pg_type
                  ? {
                      label: formData.pg_type.toUpperCase(),
                      value: formData.pg_type,
                    }
                  : null
              }
              onChange={(option) =>
                setFormData({ ...formData, pg_type: option?.value || "" })
              }
              placeholder="Select PG Type"
              className="mb-2"
            />
          </div>

          {/* Row 2 — Rent Range */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="w-4 h-4 bg-buttons cursor-pointer rounded"
                checked={enabledFilters.rent}
                onChange={() => toggleFilterEnable("rent")}
              />
              <label className="text-gray-700 font-medium">Rent Range</label>
            </div>
            <div
              className={`${
                enabledFilters.rent
                  ? ""
                  : "opacity-50 pointer-events-none cursor-not-allowed"
              }`}
            >
              <RangeSlider
                values={values}
                setValues={setValues}
                MAX={20000}
                MIN={2000}
                STEP={2000}
                unit="Rs"
                //
              />
            </div>
          </div>

          {/* Row 3 — Wifi Available */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="w-4 h-4 bg-buttons cursor-pointer rounded"
                checked={enabledFilters.wifi_available}
                onChange={() => toggleFilterEnable("wifi_available")}
              />
              <label className="text-gray-700 font-medium">
                Wifi Available
              </label>
            </div>
            <button
              type="button"
              disabled={!enabledFilters.wifi_available}
              onClick={() =>
                setFormData({
                  ...formData,
                  wifi_available:
                    formData.wifi_available === "yes" ? "no" : "yes",
                })
              }
              className={`w-12 h-6 rounded-full p-1 flex items-center transition ${
                formData.wifi_available === "yes"
                  ? "bg-buttons justify-end"
                  : "bg-gray-300 justify-start"
              } ${
                !enabledFilters.wifi_available
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow"></span>
            </button>
          </div>

          {/* Row 4 — Food Available */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                className="w-4 h-4 bg-buttons cursor-pointer rounded"
                checked={enabledFilters.food_available}
                onChange={() => toggleFilterEnable("food_available")}
              />
              <label className="text-gray-700 font-medium">
                Food Available
              </label>
            </div>
            <button
              type="button"
              disabled={!enabledFilters.food_available}
              onClick={() =>
                setFormData({
                  ...formData,
                  food_available:
                    formData.food_available === "yes" ? "no" : "yes",
                })
              }
              className={`w-12 h-6 rounded-full p-1 flex items-center transition ${
                formData.food_available === "yes"
                  ? "bg-buttons justify-end"
                  : "bg-gray-300 justify-start"
              } ${
                !enabledFilters.food_available
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <span className="w-4 h-4 bg-white rounded-full shadow"></span>
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn bg-buttons hover:bg-buttonsHover text-white px-3 py-2 rounded-lg w-full"
          >
            Apply Filters
          </button>
        </form>
      </div>
    </div>
  );
}

export default FilterModal;
