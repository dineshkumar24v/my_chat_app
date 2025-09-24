import { formatDistanceToNow } from "date-fns";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";

  // If using Firestore timestamp, convert to JS Date
  const dateObj =
    timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);

  return formatDistanceToNow(dateObj, { addSuffix: true });
};
export { formatRelativeTime };

export const formatDaySeparator = (timestamp) => {
  const date = typeof timestamp === 'string' ? parseISO(timestamp) : (
    timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp)
  );

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
};
