import api from './api'

const sliderService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/slider-list', { params: { per_page: 10, ...params } }),

  // ADMIN
  getById:       (id)       => api.get(`/admin/edit-slider/${id}`),
  create:        (data)     => api.post('/admin/add-slider', data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  update:        (id, data) => api.post(`/admin/update-slider/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  destroy:       (id)       => api.delete(`/admin/delete-slider/${id}`),
  restore:       (id)       => api.post(`/admin/restore-slider/${id}`),
  forceDelete:   (id)       => api.delete(`/admin/force-delete-slider/${id}`),
  trashedList:   ()         => api.get('/admin/delete-slider-list'),
  changeStatus:  (id)       => api.post(`/admin/status-slider/${id}`),
}

export default sliderService