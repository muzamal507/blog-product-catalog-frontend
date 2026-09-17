import api from "./api";

// Fetch the list of navigation menu links
export const getMenus = async () => {
    const response = await api.get("/menu-list");
    return response.data;
};

export const editMenu = (id) =>
    api.get(`/menus/${id}`);

export const createMenu = (data) =>
    api.post("/add-menu", data);

export const updateMenu = (menuId, itemId, data) =>
    api.put(`/menus/${menuId}/item/${itemId}`, data);

export const deleteMenu = (id) =>
    api.delete(`/menus/${id}/trash`);

export const restoreMenu = (id) =>
    api.patch(`/menus/${id}/restore`);

export const forceDeleteMenu = (id) =>
    api.delete(`/menus/${id}/force`);

export const changeMenuStatus = (id, status) =>
    api.patch(`/menus/${id}/status`, {
        status,
    });

export const getTrashMenus = () =>
    api.get("/menus/trash");


