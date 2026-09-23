import api from '../api'

const blogPostService = {
  // PUBLIC
  getAll: (params = {}) =>
    api.get('/post-list', { params: { per_page: 6, ...params } }),

  getBySlug: (slug) =>
    api.get(`/blog/${slug}`),

  getRelated: (categoryId, postId) =>
    api.get(`/related-posts/${categoryId}/${postId}`),

  getNavigation: (id) =>
    api.get(`/post-navigation/${id}`),

  getFeatured: async (limit = 4) => {
    const res = await api.get('/post-list', {
      params: { status: 'Published', per_page: 20 }
    })
    const posts  = res.data?.data || []
    const sorted = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
    return { ...res.data, data: sorted }
  },

  getRecent: (limit = 5) =>
    api.get('/post-list', { params: { status: 'Published', per_page: limit, sort: 'latest' } }),

  // ADMIN
  adminList: (params = {}) =>
    api.get('/post-list', { params }),

  getById:      (id)       => api.get(`/admin/posts/${id}`),
  store:        (data)     => api.post('/admin/add-post', data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  update:       (id, data) => api.post(`/admin/posts/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }}),
  changeStatus: (id, status) => api.post(`/admin/posts/${id}/status`, { status }),
  destroy:      (id)       => api.delete(`/admin/posts/${id}`),
  restore:      (id)       => api.post(`/admin/posts/${id}/restore`),
  forceDelete:  (id)       => api.delete(`/admin/posts/${id}/force`),
  trashedList:  ()         => api.get('/admin/posts/trash'),
}

export default blogPostService