import api from './api'

const activityService = {
  getAll:  (params = {}) => api.get('/admin/activity-list', { params }),
  getById: (id)          => api.get(`/admin/activity/${id}`),
  destroy: (id)          => api.delete(`/admin/delete-activity/${id}`),
}

export default activityService