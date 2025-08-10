'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const FILTERS_CONFIG = [
  { label: "Type", query_param_value: "pg_type" },
  { label: "Lower Rent Range", query_param_value: "minRent" },
  { label: "Upper Rent Range", query_param_value: "maxRent" },
  { label: "Wifi Available", query_param_value: "wifi_available" },
  { label: "Food Available", query_param_value: "food_available" },
];

export const AppliedFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [appliedFilters, setAppliedFilters] = useState([]);

  // Collect pills to show whenever the URL updates
  useEffect(() => {
    const filters = FILTERS_CONFIG.flatMap(({ label, query_param_value }) => {
      // Special handling for rent range
      if (query_param_value === "minRent") {
        const min = searchParams.get("minRent");
        const max = searchParams.get("maxRent");

        if (min || max) {
          return [
            {
              label: "Rent Range",
              key: "rentRange",
              value: `${min || 0} - ${max || "∞"}`, // fallback values if missing
            },
          ];
        }
        return [];
      }

      // Skip maxRent because it's already handled with minRent
      if (query_param_value === "maxRent") return [];

      const values = searchParams.getAll(query_param_value);
      return values.map((value) => ({
        label,
        key: query_param_value,
        value,
      }));
    });
    setAppliedFilters(filters);
  }, [searchParams]);

  // Remove one value from filter and update URL using Next.js router
  function handleRemove(key:string, value:string) {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "rentRange") {
      // Remove both minRent and maxRent
      params.delete("minRent");
      params.delete("maxRent");
    } else {
      // Remove only the matching value for normal filters
      const values = params.getAll(key).filter((v) => v !== value);
      params.delete(key);
      values.forEach((v) => params.append(key, v));
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className={`flex justify-start items-center flex-wrap gap-2 ${
        appliedFilters.length > 0 ? "mt-6" : ""
      }`}
    >
      {appliedFilters.length > 0 && (
        <span className="text-gray-500">Applied Filters</span>
      )}
      {appliedFilters?.map(({ label, key, value }) => (
        <span
          key={`${key}-${value}`}
          className="inline-flex items-center bg-buttons text-white px-3 py-1 rounded-md text-sm font-medium"
        >
          {label}: {value}
          <button
            onClick={() => handleRemove(key, value)}
            className="ml-2 text-white hover:text-gray-200 focus:outline-none"
            aria-label={`Remove ${label} ${value}`}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );
}
