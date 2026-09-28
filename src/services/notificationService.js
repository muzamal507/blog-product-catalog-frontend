import api from './api'

const notificationService = {
  getAll:       (params = {}) => api.get('/admin/notification-list', { params }),
  getById:      (id)          => api.get(`/admin/notifications/${id}`),
  store:        (data)        => api.post('/admin/add-notification', data),
  update:       (id, data)    => api.put(`/admin/notifications/${id}/update`, data),
  destroy:      (id)          => api.delete(`/admin/notifications/${id}/delete`),
  markRead:     (id)          => api.patch(`/admin/notifications/${id}/read`),
  markUnread:   (id)          => api.patch(`/admin/notifications/${id}/unread`),
  markAllRead:  ()            => api.get('/admin/notifications/allRead'),
  unreadCount:  ()            => api.get('/admin/notifications/unreadCounter'),
  clearAll:     ()            => api.delete('/admin/notifications/clear'),
}

export default notificationService