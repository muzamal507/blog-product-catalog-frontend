import api from '../api'

const blogPageService = {
  // PUBLIC
  getBySlug: async (slug) => {
    const res = await api.get('/page-list', { params: { slug, per_page: 1 } })
    return res.data
  },

  getAll: (params = {}) =>
    api.get('/page-list', { params }),

  // ADMIN
  getById:      (id)       => api.get(`/admin/pages/${id}`),
  store:        (data)     => api.post('/admin/add-page', data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  update:       (id, data) => api.post(`/admin/pages/${id}/update`, data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  changeStatus: (id, status) => api.patch(`/admin/pages/${id}/status`, { status }),
  destroy:      (id)       => api.delete(`/admin/pages/${id}/trash`),
  restore:      (id)       => api.patch(`/admin/pages/${id}/restore`),
  forceDelete:  (id)       => api.delete(`/admin/pages/${id}/force`),
  trashedList:  ()         => api.get('/admin/pages/trash'),
}

export default blogPageService