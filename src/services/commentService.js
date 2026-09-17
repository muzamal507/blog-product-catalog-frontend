import api from "./api";

// List
export const getComments = async (postId) => {
    const response = await api.get("/comment-list", {
        params: {
            post_id: postId,
        },
    });
    return response.data;
};

export const getAdminComments = async (params = {}) => {
    const response = await api.get("/comment-list", {
        params,
    });
    return response.data;
};

// Edit Single
export const getComment = async (id) => {
    const res = await api.get(`/admin/comments/${id}`);
    return res.data;
};

// Create
// export const createComment = async (data) => {
//     return await api.post("/add-comment", data);
// };
export const addComment = async (data) => {
    return await api.post("/add-comment", data);
};

// Update
export const updateComment = async (id, data) => {
    return await api.put(`/admin/comments/${id}`, data);
};

// Status
export const changeCommentStatus = async (id, status) => {
    return await api.patch(`/admin/comments/${id}/status`, {
        status,
    });
};

// Soft Delete
export const deleteComment = async (id) => {
    return await api.delete(`/admin/comments/${id}/trash`);
};

// Trash List
export const getDeletedComments = async (params = {}) => {
    const res = await api.get("/admin/comments/trash", {
        params,
    });
    return res.data;
};

// Restore
export const restoreComment = async (id) => {
    return await api.patch(`/admin/comments/${id}/restore`);
};

// Force Delete
export const forceDeleteComment = async (id) => {
    return await api.delete(`/admin/comments/${id}/force`);
};

// Reaction Comment Route
// export const reactComment = async(id,reaction)=>{
//     return await api.post(`/comments/${id}/reaction`,
//         {reaction}
//     );
// };

export const reactComment = async (id, reaction) => {
    const guestToken = localStorage.getItem("guest_token");
    return await api.post(`/comments/${id}/reaction`, {
            reaction,
            guest_token: guestToken
        }
    );
};

//  Comment History Route
export const getCommentHistory = async(id)=>{
    const res = await api.get(`/admin/comments/${id}/history`);
    return res.data;
};


// ============================ Comments Notification Route============================

/**
 * Notification List
 */
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

/**
 * Delete Notification
 */
export const deleteNotification = async (id) => {
    return await api.delete(`/admin/notifications/${id}`);
};