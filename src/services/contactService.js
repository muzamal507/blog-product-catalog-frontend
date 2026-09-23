import api from './api'

const contactService = {
  // PUBLIC
  send: (data) => api.post('/add-contact-message', data),

  // ADMIN
  getAll: (params = {}) => api.get('/contact-list', { params }),
  edit:   (id)          => api.get(`/admin/contact-message/${id}`),
  reply:  (id, data)    => api.patch(`/admin/contact-message/${id}/reply`, data),
  markRead:   (id)      => api.patch(`/admin/contact-message/${id}/read`),
  markUnread: (id)      => api.patch(`/admin/contact-message/${id}/unread`),
  destroy:    (id)      => api.delete(`/admin/contact-message/${id}/delete`),
}

export default contactService