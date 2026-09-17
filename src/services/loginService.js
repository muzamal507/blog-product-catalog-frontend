import api from "./api";

export const login = async (credentials) => {

    const response = await api.post("/login", credentials);

    return response.data;

};

export const logout = async () => {

    const response = await api.post("/logout");

    return response.data;

};

export const profile = async () => {

    const response = await api.get("/profile");

    return response.data;

};