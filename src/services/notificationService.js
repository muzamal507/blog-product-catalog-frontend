import api from "./api";

// /**
//  * Notification List
//  */
export const getNotifications = async (params = {}) => {
    return await api.get("/admin/notifications", {
        params,
    });
};

/**
 * Unread Count
 */
export const getUnreadNotificationCount = async () => {
    return await api.get("/admin/notifications/unread-count");
};

/**
 * Mark Single Read
 */
export const markNotificationRead = async (id) => {
    return await api.patch(`/admin/notifications/${id}/read`);
};

/**
 * Mark All Read
 */
export const markAllNotificationsRead = async () => {
    return await api.patch("/admin/notifications/read-all");
};

export const getNotification = (id) =>
    api.get(`/notifications/${id}`);

export const createNotification = (data) =>
    api.post("/add-notification", data);

export const updateNotification = (id, data) =>
    api.put(`/notifications/${id}/update`, data);

export const deleteNotification = (id) =>
    api.delete(`/notifications/${id}/delete`);

export const markRead = (id) =>
    api.patch(`/notifications/${id}/read`);

export const markAllRead = () =>
    api.get("/notifications/all-read");

export const unreadCount = () =>
    api.get("/notifications/unread-count");

export const clearNotifications = () =>
    api.delete("/notifications/clear-all");

export const markUnread = () =>
    api.patch("/notifications/unread");