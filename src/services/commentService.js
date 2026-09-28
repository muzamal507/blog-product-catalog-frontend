import api from './api'

const commentService = {
  // ADMIN
  getAll:       (params = {}) => api.get('/admin/comment-list', { params }),
  getById:      (id)          => api.get(`/admin/comments/${id}`),
  update:       (id, data)    => api.put(`/admin/comments/${id}`, data),
  changeStatus: (id, status)  => api.patch(`/admin/comments/${id}/status`, { status }),
  destroy:      (id)          => api.delete(`/admin/comments/${id}/trash`),
  restore:      (id)          => api.patch(`/admin/comments/${id}/restore`),
  forceDelete:  (id)          => api.delete(`/admin/comments/${id}/force`),
  trashedList:  (params = {}) => api.get('/admin/comments/trash', { params }),
  getHistory:   (id)          => api.get(`/admin/comments/${id}/history`),

  // PUBLIC
  addComment: (data) => api.post('/add-comment', data),
  react: (id, reaction) => {
    const guestToken = localStorage.getItem('guest_token')
    return api.post(`/comments/${id}/reaction`, { reaction, guest_token: guestToken })
  },
}

export default commentService