import { Star } from "@phosphor-icons/react/dist/ssr";

type Props = {
  no_of_star: number;
};

const ratingConfig = {
  1: { comment: "Bad", color: "bg-red-500" },        // Strong red
  2: { comment: "Poor", color: "bg-orange-500" },    // Orange
  3: { comment: "Average", color: "bg-yellow-500" }, // Yellow
  4: { comment: "Good", color: "bg-green-400" },     // Light green
  5: { comment: "Excellent", color: "bg-green-600" } // Dark green
};

export default function Rating({ no_of_star }: Props) {
  return (
    <div className="flex flex-row gap-3">
      <div className="flex flex-row">
        {Array.from({ length: no_of_star }, (_, index) => (
          <Star key={index} size={15} weight="fill" className=" text-ratingStarCol" />
        ))}
        {Array.from({ length: 5-no_of_star }, (_, index) => (
          <Star key={index} size={15}/>
        ))}
      </div>
      <div className={`${ratingConfig[no_of_star as 1 | 2 | 3 | 4 | 5]?.color} px-2 text-xs rounded-md text-white`}>{ratingConfig[no_of_star as 1 | 2 | 3 | 4 | 5]?.comment}</div>
    </div>
  );
}
