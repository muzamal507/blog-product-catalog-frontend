import api from './api'

const settingService = {
  // PUBLIC — site settings fetch
  getPublic: () => api.get('/setting-list'),

  // ADMIN
  edit:   (id)       => api.get(`/admin/settings/${id}`),
  store:  (data)     => api.post('/admin/settings', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.post(`/admin/settings/${id}/update`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export default settingService