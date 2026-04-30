import { useCallback } from "react";
import { useTask } from "./useTask";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

export const useTaskFetch = () => {

    const [searchParams] = useSearchParams();

    const { setLoadingTasks, setTasks } = useTask();

    const fetchTasks = useCallback(async () => {
        try {
            setLoadingTasks(true);

            const search = searchParams.get("search");
            const filter = searchParams.get("filter");

            const url = new URL(`${API_BASE_URL}/api/tasks/read`);

            if (filter) url.searchParams.set("filter", filter);
            if (search) url.searchParams.set("search", search);

            const res = await fetch(url.toString(), {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch tasks");
            }
            const data = await res.json();
            setTasks(data.data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoadingTasks(false);
        }
    }, [searchParams, setLoadingTasks, setTasks]);

    return fetchTasks;

}