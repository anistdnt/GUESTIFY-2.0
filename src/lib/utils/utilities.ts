export const formatDate = (isodate: string) => {
  const currentDate = new Date(isodate);
  const date = currentDate.toLocaleDateString("en-GB", {
    weekday: "short", // 'Tue'
    day: "2-digit", // '07'
    month: "long", // 'June'
    year: "numeric", // '2022'
  });

  const [weekday, day, month, year] = date.split(" ");
  const formattedDate = `${weekday}, ${day} ${month} ${year}`;

  return formattedDate;
};

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}