import { Priority, Status } from "../graphql/query";

export const getPriorityColor: Record<Priority, string> = {
  low: "bg-black",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};
export const getStatusColor: Record<Status, string> = {
  open: "bg-black",
  in_progress: "bg-yellow-500",
  resolved: "bg-green-500",
  closed: "bg-blue-500",
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formattedUTC = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return formattedUTC;
};

export const getToken = (): string | null =>
  localStorage.getItem("TIC_AUTH_TOKEN");

export const setToken = (token: string): void =>
  localStorage.setItem("TIC_AUTH_TOKEN", token);

export const removeToken = (): void =>
  localStorage.removeItem("TIC_AUTH_TOKEN");
