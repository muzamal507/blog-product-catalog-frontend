import api from './api'

const orderService = {
  // PUBLIC
  placeOrder: (data) => api.post('/place-order', data),

  // ADMIN
  adminList:  (params = {}) => api.get('/admin/orders', { params }),
  show:       (id)          => api.get(`/admin/orders/${id}`),
  store:      (data)        => api.post('/admin/orders', data),
  update:     (id, data)    => api.post(`/admin/orders/${id}`, data),
  stats:      ()            => api.get('/admin/orders/stats'),

  changeStatus: (id, status) =>
    api.patch(`/admin/orders/${id}/status`, { status }),

  destroy: (id) =>
    api.delete(`/admin/orders/${id}/trash`),
}

export default orderService