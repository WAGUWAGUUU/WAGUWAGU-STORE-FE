import { api } from "../config/network";

export const saveMenuCategory = async (menuCategoryInfo) => {
    await api("/api/v1/menu-category", "post", menuCategoryInfo);
}

export const getMenuCategoriesByStoreId = async (storeId) => {
    const res = await api(`/api/v1/menu-category/store/${storeId}`, "get");
    console.log(res.data);
    return res.data;
}
