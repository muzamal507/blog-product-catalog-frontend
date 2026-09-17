import api from "./api";

export const getActivities = (params) =>
    api.get("/activity-list", { params });

export const deleteActivity = (id) =>
    api.delete(`/delete-activity/${id}`);
