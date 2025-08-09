import { setModalVisibility } from "@/redux/slices/modalSlice";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";

type FilterIconProps = {
  allowed_query_highlight?: string[];
};

export const FilterIcon = ({ allowed_query_highlight = [] }: FilterIconProps) => {
  const dispatch = useDispatch();
  const query = useSearchParams();

  // Check if any allowed query param exists in the current URL
  const isHighlighted = allowed_query_highlight?.some(param => query.has(param));

  console.log("Highlighted===>", isHighlighted, allowed_query_highlight, query.toString());

  const handleFilterClick = () => {
    dispatch(
      setModalVisibility({
        open: true,
        type: "filter",
      })
    );
  };

  // Define SVG classes: add highlight styles if isHighlighted is true
  const svgClassName = `
    h-12 w-12 cursor-pointer p-3 rounded-md bg-slate-100 
    ${isHighlighted ? "text-yellow-600" : "text-gray-500 hover:text-gray-700"}
  `;

  return (
    <div onClick={handleFilterClick} role="button" tabIndex={0} aria-label="Open filter modal">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={svgClassName}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-7.414 7.414a1 1 0 00-.293.707V20a1 1 0 01-2 0v-5.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z"
        />
      </svg>
    </div>
  );
};
