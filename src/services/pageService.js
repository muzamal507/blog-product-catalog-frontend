import api from "./api";

export const getPage = async (slug) => {
    const response = await api.get("/page-list", {
        params: {
            slug,
            per_page: 1,
        },
    });

    return response.data;
};

// For Admin site
export const getPages = (params = {}) =>
    api.get("/page-list", {
        params,
    });

export const editPage = (id) =>
    api.get(`/pages/${id}`);

export const createPage = (data) =>
    api.post("/add-page", data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    });

export const updatePage = (id,data)=>
    api.post(`/pages/${id}/update/`,data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    });

export const deletePage=(id)=>
    api.delete(`/pages/${id}/trash`);

export const restorePage=(id)=>
    api.patch(`/pages/${id}/restore`);

export const forceDeletePage=(id)=>
    api.delete(`/pages/${id}/forece`);

export const changeStatus=(id,status)=>
    api.patch(`/pages/${id}/status`,{
        status
    });