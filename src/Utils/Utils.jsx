import { formatDistanceToNow } from "date-fns";

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";

  // If using Firestore timestamp, convert to JS Date
  const dateObj =
    timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);

  return formatDistanceToNow(dateObj, { addSuffix: true });
};
export { formatRelativeTime };