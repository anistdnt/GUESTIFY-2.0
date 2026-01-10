import { StarHalfIcon, StarIcon } from "@phosphor-icons/react";

type Props = {
  no_of_star: number;
};

const ratingConfig = {
  1: { comment: "Bad", color: "bg-red-500" },
  2: { comment: "Poor", color: "bg-orange-500" },
  3: { comment: "Average", color: "bg-yellow-500" },
  4: { comment: "Good", color: "bg-green-400" },
  5: { comment: "Excellent", color: "bg-green-600" },
} as const;

export default function Rating({ no_of_star }: Props) {
  // Clamp between 0 and 5
  const rating = Math.min(Math.max(no_of_star, 0), 5);

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Use rounded value for label/color
  const labelKey = Math.round(rating) as keyof typeof ratingConfig;
  const label = ratingConfig[labelKey];

  return (
    <div className="flex items-center gap-3">
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon
            key={`full-${i}`}
            size={15}
            weight="fill"
            className="text-ratingStarCol"
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <StarHalfIcon
            size={15}
            weight="fill"
            className="text-ratingStarCol"
          />
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon key={`empty-${i}`} size={15} />
        ))}
      </div>

      {/* Label */}
      <div
        className={`${label.color} px-2 py-0.5 text-xs rounded-md text-white`}
      >
        {label.comment}
      </div>
    </div>
  );
}
