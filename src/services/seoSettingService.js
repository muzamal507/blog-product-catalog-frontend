import api from "./api";

export const getSeoSetting = () =>
    api.get("/seo-setting-list");

export const getSeoById = (id) =>
    api.get(`/seo-settings/${id}`);

export const createSeoSetting = (data) =>
    api.post("/seo-settings", data,{
        headers:{
            "Content-Type":"multipart/form-data",
        },
    });

export const updateSeoSetting = (id,data) =>
    api.post(`/seo-settings/${id}`,data,{
        headers:{
            "Content-Type":"multipart/form-data",
        },
    });

export const deleteSeoSetting = (id)=>
    api.delete(`/seo-settings/${id}/delete`);