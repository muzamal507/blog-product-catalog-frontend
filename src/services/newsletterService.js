import api from './api'

const newsletterService = {
  // PUBLIC
  subscribe: (email) =>
    api.post('/add-newsletter', { email, status: 'Subscribed' }),

  // ADMIN
  getAll:         (params = {}) => api.get('/newsletter-list', { params }),
  getById:        (id)          => api.get(`/admin/newsletters/${id}`),
  update:         (id, data)    => api.put(`/admin/newsletters/${id}`, data),
  destroy:        (id)          => api.delete(`/admin/newsletters/${id}/trash`),
  changeStatus:   (id)          => api.patch(`/admin/newsletters/${id}/status`),
  trashedList:    ()            => api.get('/admin/newsletters/trash'),
  restore:        (id)          => api.patch(`/admin/newsletters/${id}/restore`),
  forceDelete:    (id)          => api.delete(`/admin/newsletters/${id}/force`),

  // SEND NEWSLETTER
  sendNewsletter: (data)        => api.post('/admin/newsletters/send', data),
}

export default newsletterService