import api from './api'

const testimonialService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/testimonial-list', { params }),

  getFeatured: () =>
    api.get('/testimonial-list', { params: { featured: 1, all: 1 } }),

  // ADMIN
  adminList: (params = {}) =>
    api.get('/admin/testimonials', { params }),

  edit: (id) =>
    api.get(`/admin/testimonials/${id}`),

  store: (data) =>
    api.post('/admin/testimonials', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, data) =>
    api.post(`/admin/testimonials/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  changeStatus:   (id) => api.patch(`/admin/testimonials/${id}/status`),
  toggleFeatured: (id) => api.patch(`/admin/testimonials/${id}/featured`),
  destroy:        (id) => api.delete(`/admin/testimonials/${id}/trash`),
  restore:        (id) => api.patch(`/admin/testimonials/${id}/restore`),
  forceDelete:    (id) => api.delete(`/admin/testimonials/${id}/force`),

  trashedList: (params = {}) =>
    api.get('/admin/testimonials/trash', { params }),
}

export default testimonialService