import api from './api'

const productCategoryService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/product-category-list', { params }),

  getTree: () =>
    api.get('/product-category-tree'),

  // ADMIN
  adminList: (params = {}) =>
    api.get('/admin/product-categories', { params }),

  store: (data) =>
    api.post('/admin/product-categories', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }),

  edit: (id) =>
    api.get(`/admin/product-categories/${id}`),

  update: (id, data) =>
    api.post(`/admin/product-categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  changeStatus: (id) =>
    api.patch(`/admin/product-categories/${id}/status`),

  destroy: (id) =>
    api.delete(`/admin/product-categories/${id}/trash`),

  restore: (id) =>
    api.patch(`/admin/product-categories/${id}/restore`),

  forceDelete: (id) =>
    api.delete(`/admin/product-categories/${id}/force`),

  trashedList: (params = {}) =>
    api.get('/admin/product-categories/trash', { params }),

  getStatuses: () =>
    api.get('/admin/product-categories/statuses'),
}

export default productCategoryService