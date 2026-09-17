import api from "./api";

/**
 * Fetch paginated categories from /category-list
 * @param {Object} params - search, status, sort, per_page, page
 */
export const getCategories = async (params = {}) => {
    const response = await api.get("/category-list", {
        params: { per_page: 50, ...params },
    });
    return response.data;
};

// ======================= Admin Part =======================

//  Create Category
export const createCategory = (data) =>
    api.post("/store-category", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });


// Edit Category
export const getCategory = async (id) => {
    const response = await api.get(`/category/${id}`);
    return response.data.data;
};

// Update Category
export const updateCategory = async (id, data) => {
    const response = await api.post(`/category/${id}`, data);
    return response.data;
};

// Soft Delete Category
export const deleteCategory = (id) =>
    api.delete(`/category/${id}/trash`);

// Change Status Category
export const changeCategoryStatus = (id, status) =>
    api.post(`/category/${id}/status`, { status });

// Soft Delete List Category
export const getDeletedCategories = async (params = {}) => {
    const response = await api.get("/categories/trash", {
        params,
    });
    return response.data;
};

// Restore Category
export const restoreCategory = async (id) => {
    return await api.post(`/category/${id}/restore`);
};

// Force Delete Category
export const forceDeleteCategory = async (id) => {
    return await api.delete(`/delete/${id}/force`);
};