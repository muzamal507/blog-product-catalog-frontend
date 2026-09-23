import api from '../api'

const blogTagService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/tag-list', { params: { per_page: 50, ...params } }),

  // ADMIN
  getById:      (id)       => api.get(`/admin/tags/${id}`),
  store:        (data)     => api.post('/admin/add-tag', data),
  update:       (id, data) => api.post(`/admin/tags/${id}`, data),
  changeStatus: (id)       => api.post(`/admin/tags/${id}/status`),
  destroy:      (id)       => api.delete(`/admin/tags/${id}/trash`),
  restore:      (id)       => api.post(`/admin/tags/${id}/restore`),
  forceDelete:  (id)       => api.delete(`/admin/tags/${id}/force`),
  trashedList:  (params={})=> api.get('/admin/tags/trash', { params }),
}

export default blogTagService