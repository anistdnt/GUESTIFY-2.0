import { Star } from "@phosphor-icons/react/dist/ssr";
import "./rating.css";

type Props = {
  no_of_star: number;
};

export default function Rating({ no_of_star }: Props) {
  return (
    <div className="flex flex-row gap-3">
      <div className="flex flex-row">
        {Array.from({ length: no_of_star }, (_, index) => (
          <Star key={index} size={20} weight="fill" className="checked-star" />
        ))}
        {Array.from({ length: 5-no_of_star }, (_, index) => (
          <Star key={index} size={20}/>
        ))}
      </div>
      <div className="bg-yellow-300 px-3 text-sm rounded-md">{no_of_star}</div>
    </div>
  );
}
