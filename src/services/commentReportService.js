import api from "./api";

export const getReports = (params = {}) => {
    return api.get("/admin/comment-reports", {
        params,
    });
};

export const getReport = (id) => {
    return api.get(`/admin/comment-reports/${id}`);
};

export const updateReportStatus = (id, data) => {
    return api.patch(`/admin/comment-reports/${id}/status`, data);
};

export const deleteReport = (id) => {
    return api.delete(`/admin/comment-reports/${id}`);
};