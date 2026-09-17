import api from "./api";

/**
 * Fetch paginated posts from /post-list
 * @param {Object} params - search, category_id, status, author_id, sort, per_page, page
 */

// List Posts
// export const getPosts = async ({ search = "", page = 1 }) => {
//     return await api.get("/post-list", {
//         params: {search, page},
//     });
// };

export const getPosts = async ({search = "", page = 1, category_id = "", tag_id = "", sort = "latest",
    per_page = 6, }) => {
    const response = await api.get("/post-list", {
        params: {
            search, page, category_id, tag_id, sort, per_page,
        },
    });
    return response.data;
};

/**
 * Fetch a single post by slug (increments view count)
 */
// Single Blog
export const getPostBySlug = async (slug) => {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
};

/**
 * Featured posts: top published posts by views (backend has no is_featured filter)
 */
// Featured
export const getFeaturedPosts = async (limit = 4) => {
    const response = await api.get("/post-list", {
        params: { status: "Published", per_page: 20 },
    });
    const posts = response.data?.data || [];
    const featured = [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, limit);

    return { ...response.data, data: featured };
};

/**
 * Recent posts for sidebar widgets
 */
// Recent
export const getRecentPosts = async (limit = 5) => {
    const response = await api.get("/post-list", {
        params: { status: "Published", per_page: limit, sort: "latest" },
    });
    return response.data;
};

/**
 * Popular posts sorted by views
 */
export const getPopularPosts = async (limit = 5) => {
    const response = await api.get("/post-list", {
        params: { status: "Published", per_page: 20 },
    });
    const posts = response.data?.data || [];
    const popular = [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, limit);

    return { ...response.data, data: popular };
};

// Related
export const getRelatedPosts = async (categoryId, postId) => {
    const response = await api.get(
        `/related-posts/${categoryId}/${postId}`
    );

    return response.data;
};

// Navigation
export const getPostNavigation = async (id) => {
    const response = await api.get(`/post-navigation/${id}`);
    return response.data;
};

// =================== ADMIN ===================

export const createPost = async (data) => {
    return api.post("/add-post", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const editPost = async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
};

export const updatePost = async (id, data) => {
    return api.post(`/posts/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deletePost = async (id) => {
    return await api.delete(`/posts/${id}`);
};

export const changeStatus = async (id, status) => {
    return api.post(`/posts/${id}/status`, {
        status,
    });
};

export const getDeletedPosts = async () => {
    const response = await api.get("/posts/trash");
    return response.data;
};

export const restorePost = async (id) => {
    return api.post(`/posts/${id}/restore`);
};

export const forceDeletePost = async (id) => {
    return api.delete(`/posts/${id}/force`);
};