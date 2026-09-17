import api from "./api";

/**
 * Fetch sliders from /slider-list
 * @param {Object} params - search, status, sort, per_page, page
 */
export const getSliders = async (params = {}) => {
    const response = await api.get("/slider-list", {
        params: { 
            // status: "Active", 
            per_page: 10, 
            ...params },
    });
    return response.data;
};

export const getSlider = (id) =>
    api.get(`/edit-slider/${id}`);

export const createSlider = (data) =>
    api.post("/add-slider", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const updateSlider = (id, data) =>
    api.post(`/update-slider/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const deleteSlider = (id) =>
    api.delete(`/delete-slider/${id}`);

export const restoreSlider = (id) =>
    api.post(`/restore-slider/${id}`);

export const forceDeleteSlider = (id) =>
    api.delete(`/force-delete-slider/${id}`);

export const sliderTrash = () =>
    api.get("/delete-slider-list");

export const changeSliderStatus = (id, status) =>
    api.post(`/status-slider/${id}`, { status });