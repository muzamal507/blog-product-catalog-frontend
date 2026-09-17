import api from "./api";

// Subscribe to newsletter
export const subscribeNewsletter = async (email) => {
    const response = await api.post("/add-newsletter", {
        email: email,
        status: "Subscribed"
    });
    return response.data;
};

export const createNewsletter = (data) =>
    api.post("/add-newsletter", data);

export const getNewsletters = (params) =>
    api.get("/newsletter-list", { params });

export const getNewsletterById = (id) =>
    api.get(`/newsletters/${id}`);

export const updateNewsletter = (id, data) =>
    api.put(`/newsletters/${id}`, data);

export const deleteNewsletter = (id) =>
    api.delete(`/newsletters/${id}/trash`);

export const changeNewsletterStatus = (id) =>
    api.patch(`/newsletterS/${id}/status`);

export const getTrashNewsletters = () =>
    api.get("/newsletters/trash");

export const restoreNewsletter = (id) =>
    api.patch(`/newsletters/${id}/restore`);

export const forceDeleteNewsletter = (id) =>
    api.delete(`/newsletters/${id}/force`);