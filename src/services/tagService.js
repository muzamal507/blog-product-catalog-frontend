import api from "./api";

/**
 * Fetch paginated tags from /tag-list
 * @param {Object} params - search, status, sort, per_page, page
 */
export const getTags = async (params = {}) => {
    const response = await api.get("/tag-list", {
        params: { 
            // status: "Active", 
            search: "",
            page: 1,
            ...params },
    });
    return response.data;
};

// Create
export const createTag = async (data) => {
    return await api.post("/add-tag", data);
};

// Edit
export const getTag = async (id) => {
    const response = await api.get(`/tags/${id}`);
    return response.data.data;
};

// Update
export const updateTag = async (id, data) => {
    const response = await api.post(`/tags/${id}`, data);
    return response.data;
};

// Status
export const changeTagStatus = async (id) => {
    return await api.post(`/tags/${id}/status`);
};

// Trash
export const deleteTag = async (id) => {
    return await api.delete(`/tags/${id}/trash`);
};

// Deleted list
export const getDeletedTags = async (params = {}) => {
    const response = await api.get("/tags/trash", {
        params,
    });
    return response.data;
};

// Restore
export const restoreTag = async (id) => {
    return await api.post(`/tags/${id}/restore`);
};

// Force Delete
export const forceDeleteTag = async (id) => {
    return await api.delete(`/tags/${id}/force`);
};