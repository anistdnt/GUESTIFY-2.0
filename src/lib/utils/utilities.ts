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

export function formatSeconds(seconds: number): string {
  if (seconds < 0 || isNaN(seconds)) return "Expired";

  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}


export function formatTTL(seconds: number) {
  if (!seconds || seconds <= 0) return "Expired";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s remaining`;
};