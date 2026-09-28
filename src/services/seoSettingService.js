import api from './api'

const seoService = {
  // PUBLIC
  getPublic: () => api.get('/seo-setting-list'),

  // ADMIN
  getById: (id) => api.get(`/admin/seo-settings/${id}`),

  store: (data) =>
    api.post('/admin/seo-settings', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, data) =>
    api.post(`/admin/seo-settings/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  destroy: (id) => api.delete(`/admin/seo-settings/${id}/delete`),
}

export default seoService