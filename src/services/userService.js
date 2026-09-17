import api from "./api";

/*
|--------------------------------------------------------------------------
| Users List
|--------------------------------------------------------------------------
*/
export const getUsers = async (params = {}) => {
    const response = await api.get("/user-list", {
        params,
    });
    return response.data;
};

// User Role
export const getRoles = async () => {
    const response = await api.get("/roles");
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Single User
|--------------------------------------------------------------------------
*/
export const getUser = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
};

/*
|--------------------------------------------------------------------------
| Create User
|--------------------------------------------------------------------------
*/
export const createUser = async (data) => {
    return await api.post("/create-user", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/*
|--------------------------------------------------------------------------
| Update User
|--------------------------------------------------------------------------
*/

export const updateUser = async (id, data) => {
    return await api.post(`/users/${id}/update`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

/*
|--------------------------------------------------------------------------
| Change Status
|--------------------------------------------------------------------------
*/
export const changeUserStatus = async (id, status) => {
    return await api.post(`/users/${id}/status`, {
        status,
    });
};

// status route
export const getStatuses = async () => {
    const response = await api.get("/user-statuses");
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/
export const deleteUser = async (id) => {
    return await api.delete(`/users/${id}/trash`);
};

/*
|--------------------------------------------------------------------------
| Trash List
|--------------------------------------------------------------------------
*/
export const getDeletedUsers = async (params = {}) => {
    const response = await api.get("/users/trash", {
        params,
    });
    return response.data;
};

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/
export const restoreUser = async (id) => {
    return await api.post(`/users/${id}/restore`);
};

/*
|--------------------------------------------------------------------------
| Force Delete
|--------------------------------------------------------------------------
*/
export const forceDeleteUser = async (id) => {
    return await api.delete(`/users/${id}/force`);
};