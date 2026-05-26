import { API_BASE_URL } from "../config/api";
import { authFetch } from "./authFetch";

export const getTasks = async (searchParams: URLSearchParams) => {
  try {
    const search = searchParams.get("search");
    const filter = searchParams.get("filter");
    const url = new URL(`${API_BASE_URL}/api/tasks/read`);

    if (filter) url.searchParams.set("filter", filter);
    if (search) url.searchParams.set("search", search);

    const res = await authFetch(url.toString());

    if (!res.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
};
