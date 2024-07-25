import { api } from "../config/network";

export const saveMenu = async (menuInfo) => {
    await api("/api/v1/menu", "post", menuInfo);
}

export const getMenuByMenuCategoryId = async (menuCategoryId) => {
    const res = await api(`/api/v1/menu/menu-category/${menuCategoryId}`, "get");
    console.log(res.data);
    return res.data;
}