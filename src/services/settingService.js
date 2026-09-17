import api from "./api";

// Fetch public settings for the blog site
export const getSettings = async () => {
    const response = await api.get("/setting-list");
    return response.data;
};

export const editSetting = (id) =>
    api.get(`/settings/${id}`);

export const createSetting = (data) =>
    api.post("/settings", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const updateSetting = (id, data) =>
    api.post(`/settings/${id}/update`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });