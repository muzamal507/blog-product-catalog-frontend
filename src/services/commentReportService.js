import api from './api'

const commentReportService = {
  getAll:        (params = {}) => api.get('/admin/comment-reports', { params }),
  getById:       (id)          => api.get(`/admin/comment-reports/${id}`),
  updateStatus:  (id, data)    => api.patch(`/admin/comment-reports/${id}/status`, data),
  destroy:       (id)          => api.delete(`/admin/comment-reports/${id}`),
}

export default commentReportService