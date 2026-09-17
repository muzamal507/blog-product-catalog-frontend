import api from './api'

const brandService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/brand-list', { params }),

  // Category select hone par brands fetch karo
  getByCategoryId: (categoryId) =>
    api.get(`/brands-by-category/${categoryId}`),

  // ADMIN
  adminList: (params = {}) =>
    api.get('/admin/brands', { params }),

  store: (data) =>
    api.post('/admin/brands', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  edit: (id) =>
    api.get(`/admin/brands/${id}`),

  update: (id, data) =>
    api.post(`/admin/brands/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  changeStatus: (id) =>
    api.patch(`/admin/brands/${id}/status`),

  destroy: (id) =>
    api.delete(`/admin/brands/${id}/trash`),

  restore: (id) =>
    api.patch(`/admin/brands/${id}/restore`),

  forceDelete: (id) =>
    api.delete(`/admin/brands/${id}/force`),

  trashedList: (params = {}) =>
    api.get('/admin/brands/trash', { params }),
}

export default brandService