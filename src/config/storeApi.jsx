import { storeApi } from "./storeNetwork";

export const getMenuCategoryByStore = async (storeId) => {
  try {
    const res = await storeApi(`/api/v1/menu-category/store/${storeId}`, "get");
    return res.data;
  } catch (error) {
    console.error("Error in getMenuCategoryByStore", error);
  }
};

export const getMenuByMenuCategory = async (menuCategoryId) => {
  try {
    const res = await storeApi(
      `/api/v1/menu/menu-category/${menuCategoryId}`,
      "get"
    );
    return res.data;
  } catch (error) {
    console.error("Error in getMenuByMenuCategory", error);
  }
};

export const getMenuByMenuId = async (menuId) => {
  try {
    const res = await storeApi(`/api/v1/menu/${menuId}`, "get");
    return res.data;
  } catch (error) {
    console.error("Error in getMenuByMenuId", error);
  }
};

export const getOptionListsByMenuId = async (menuId) => {
  try {
    const res = await storeApi(`/api/v1/option-lists/menu/${menuId}`, "get");
    return res.data;
  } catch (error) {
    console.error("Error in getOptionListsByMenuId", error);
  }
};

export const getOptionsByOptionListId = async (optionListId) => {
  try {
    const res = await storeApi(
      `/api/v1/options/menu/list/${optionListId}`,
      "get"
    );
    return res.data;
  } catch (error) {
    console.error("Error in getOptionsByOptionListId", error);
  }
};

export const getStoreByOwnerId = async (ownerId) => {
  try {
    const res = await storeApi(`/api/v1/store/owner/${ownerId}`, "get");
    return res.data;
  } catch (error) {
    // console.error("Error in getStoreByOwnerId", error);
  }
};
