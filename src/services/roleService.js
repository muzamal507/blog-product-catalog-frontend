import api from './api'

const roleService = {
  getAll:      (params = {}) => api.get('/admin/roles', { params }),
  getById:     (id)          => api.get(`/admin/roles/${id}`),
  store:       (data)        => api.post('/admin/roles', data),
  update:      (id, data)    => api.put(`/admin/roles/${id}`, data),
  destroy:     (id)          => api.delete(`/admin/roles/${id}`),
  getPermissions: ()         => api.get('/admin/permissions'),
}

export default roleService