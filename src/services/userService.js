import api from './api'

const userService = {
  // ADMIN
  getAll:       (params = {}) => api.get('/admin/user-list', { params }),
  getById:      (id)          => api.get(`/admin/users/${id}`),
  getRoles:     ()            => api.get('/admin/roles'),
  store:        (data)        => api.post('/admin/create-user', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update:       (id, data)    => api.post(`/admin/users/${id}/update`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changeStatus: (id)          => api.post(`/admin/users/${id}/status`),
  destroy:      (id)          => api.delete(`/admin/users/${id}/trash`),
  restore:      (id)          => api.post(`/admin/users/${id}/restore`),
  forceDelete:  (id)          => api.delete(`/admin/users/${id}/force`),
  trashedList:  (params = {}) => api.get('/admin/users/trash', { params }),
}

export default userService