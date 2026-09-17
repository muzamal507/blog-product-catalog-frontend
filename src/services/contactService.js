import api from "./api";

export const addContact = async (data)=>{
    const response=await api.post("/add-contact-message",data);

    return response.data;
}

// List
export const getContactMessages = (params = {}) =>
    api.get("/contact-list", { params });

// View
export const editContactMessage = (id) =>
    api.get(`/contact-message/${id}`);

// Reply
export const replyContactMessage = (id, data) =>
    api.patch(`/contact-message/${id}/reply`, data);

// Read
export const markAsRead = (id) =>
    api.patch(`/contact-message/${id}/read`);

// Unread
export const markAsUnread = (id) =>
    api.patch(`/contact-message/${id}/unread`);

// Delete
export const deleteContactMessage = (id) =>
    api.delete(`/contact-message/${id}/delete`);