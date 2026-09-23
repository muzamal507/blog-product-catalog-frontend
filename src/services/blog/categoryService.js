import api from '../api'

const blogCategoryService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/category-list', { params: { per_page: 50, ...params } }),

  // ADMIN
  getById:      (id)       => api.get(`/admin/category/${id}`),
  store:        (data)     => api.post('/admin/store-category', data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  update:       (id, data) => api.post(`/admin/category/${id}`, data),
  changeStatus: (id)       => api.post(`/admin/category/${id}/status`),
  destroy:      (id)       => api.delete(`/admin/category/${id}/trash`),
  restore:      (id)       => api.post(`/admin/category/${id}/restore`),
  forceDelete:  (id)       => api.delete(`/admin/delete/${id}/force`),
  trashedList:  (params={})=> api.get('/admin/categories/trash', { params }),
}

export default blogCategoryService