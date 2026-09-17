import api from './api'

const attributeService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/attribute-list', { params }),

  // ADMIN
  adminList: (params = {}) =>
    api.get('/admin/attributes', { params }),

  edit: (id) =>
    api.get(`/admin/attributes/${id}`),

  store: (data) =>
    api.post('/admin/attributes', data),

  update: (id, data) =>
    api.post(`/admin/attributes/${id}`, data),

  changeStatus: (id) =>
    api.patch(`/admin/attributes/${id}/status`),

  destroy: (id) =>
    api.delete(`/admin/attributes/${id}/trash`),

  restore: (id) =>
    api.patch(`/admin/attributes/${id}/restore`),

  forceDelete: (id) =>
    api.delete(`/admin/attributes/${id}/force`),

  trashedList: (params = {}) =>
    api.get('/admin/attributes/trash', { params }),

  getTypes: () =>
    api.get('/admin/attributes/types'),
}

export default attributeService