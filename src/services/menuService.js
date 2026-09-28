import api from './api'

const menuService = {
  // PUBLIC
  getAll: (params = {}) => api.get('/menu-list', { params }),

  // ADMIN
  getById:      (id)              => api.get(`/admin/menus/${id}`),
  store:        (data)            => api.post('/admin/add-menu', data),
  update:       (menuId, itemId, data) => api.put(`/admin/menus/${menuId}/item/${itemId}`, data),
  changeStatus: (id, status)      => api.patch(`/admin/menus/${id}/status`, { status }),
  destroy:      (id)              => api.delete(`/admin/menus/${id}/trash`),
  restore:      (id)              => api.patch(`/admin/menus/${id}/restore`),
  forceDelete:  (id)              => api.delete(`/admin/menus/${id}/force`),
  trashedList:  ()                => api.get('/admin/menus/trash'),
}

export default menuService