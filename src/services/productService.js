import api from './api'

const productService = {
  // PUBLIC
  getAll:      (params = {}) => api.get('/product-list', { params }),
  getBySlug:   (slug)        => api.get(`/product/${slug}`),
  getFeatured: ()            => api.get('/product-list', { params: { is_featured: 1, per_page: 3 } }),
  getNew:      ()            => api.get('/product-list', { params: { is_new: 1, per_page: 6 } }),

  // ADMIN
  adminList:      (params = {}) => api.get('/admin/products', { params }),
  edit:           (id)          => api.get(`/admin/products/${id}`),
  changeStatus:   (id)          => api.patch(`/admin/products/${id}/status`),
  toggleFeatured: (id)          => api.patch(`/admin/products/${id}/featured`),
  destroy:        (id)          => api.delete(`/admin/products/${id}/trash`),
  restore:        (id)          => api.patch(`/admin/products/${id}/restore`),
  forceDelete:    (id)          => api.delete(`/admin/products/${id}/force`),
  trashedList:    (params = {}) => api.get('/admin/products/trash', { params }),
  stockHistory:   (id)          => api.get(`/admin/products/${id}/stock`),
  adjustStock:    (id, data)    => api.post(`/admin/products/${id}/stock-adjust`, data),

  store: (data) =>
    api.post('/admin/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, data) =>
    api.post(`/admin/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

export default productService