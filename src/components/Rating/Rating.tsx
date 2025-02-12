import { Star } from "@phosphor-icons/react/dist/ssr";

type Props = {
  no_of_star: number;
};

const ratingConfig = {
  1 : {comment : "Bad",color : "bg-red-300"},
  2 : {comment : "Moderate",color : "bg-yellow-300"},
  3 : {comment : "Good",color : "bg-yellow-600"},
  4 : {comment : "Very Good",color : "bg-green-300"},
  5 : {comment : "Excellent",color : "bg-green-600"},
};

export default function Rating({ no_of_star }: Props) {
  return (
    <div className="flex flex-row gap-3">
      <div className="flex flex-row">
        {Array.from({ length: no_of_star }, (_, index) => (
          <Star key={index} size={20} weight="fill" className=" text-ratingStarCol" />
        ))}
        {Array.from({ length: 5-no_of_star }, (_, index) => (
          <Star key={index} size={20}/>
        ))}
      </div>
      <div className={`${ratingConfig[no_of_star as 1 | 2 | 3 | 4 | 5].color} px-3 text-sm rounded-md text-white`}>{ratingConfig[no_of_star as 1 | 2 | 3 | 4 | 5].comment}</div>
    </div>
  );
}
