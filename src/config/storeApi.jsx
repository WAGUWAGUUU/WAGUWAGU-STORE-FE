import { storeApi } from "./storeNetwork";

export const getMenuCategoryByStore = async (storeId) => {
  try {
    const res = await storeApi(
      `/api/v1/store/menu-category/store/${storeId}`,
      "get"
    );
    return res.data;
  } catch (error) {
    console.error("Error in getMenuCategoryByStore", error);
  }
};

export const deleteMenuCategory = async (menuCategoryId) => {
  try {
    const res = await storeApi(
      `/api/v1/store/menu-category/${menuCategoryId}`,
      "delete"
    );
    return res.data;
  } catch (error) {
    console.error("Error in deleteMenuCategory", error);
  }
};

export const updateMenuCategoryName = async (id, data) => {
  try {
    const res = await storeApi(
      `/api/v1/store/menu-category/${id}/name`,
      "put",
      data
    );
    return res.data;
  } catch (error) {
    // console.error("Error in updateMenuCategoryName", error);
  }
};

export const getMenuByMenuCategory = async (menuCategoryId) => {
  try {
    const res = await storeApi(
      `/api/v1/store/menu/menu-category/${menuCategoryId}`,
      "get"
    );
    return res.data;
  } catch (error) {
    console.error("Error in getMenuByMenuCategory", error);
  }
};

export const getMenuByMenuId = async (menuId) => {
  try {
    const res = await storeApi(`/api/v1/store/menu/${menuId}`, "get");
    return res.data;
  } catch (error) {
    console.error("Error in getMenuByMenuId", error);
  }
};

export const getOptionListsByMenuId = async (menuId) => {
  try {
    const res = await storeApi(
      `/api/v1/store/option-lists/menu/${menuId}`,
      "get"
    );
    return res.data;
  } catch (error) {
    console.error("Error in getOptionListsByMenuId", error);
  }
};

export const getOptionsByOptionListId = async (optionListId) => {
  try {
    const res = await storeApi(
      `/api/v1/store/options/menu/list/${optionListId}`,
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

export const changeMenuPossible = async (menuId) => {
  try {
    const res = await storeApi(
      `/api/v1/store/menu/${menuId}/menu-possible`,
      "get"
    );
    return res.data;
  } catch (error) {
    // console.error("Error in changeMenuPossible", error);
  }
};

export const deleteMenu = async (menuId) => {
  try {
    const res = await storeApi(`/api/v1/store/menu/${menuId}`, "delete");
    return res.data;
  } catch (error) {
    // console.error("Error in deleteMenu", error);
  }
};

export const updateMenu = async (menuId, type, data) => {
  try {
    const res = await storeApi(
      `/api/v1/store/menu/${menuId}?type=${type}`,
      "put",
      data
    );
    return res.data;
  } catch (error) {
    // console.error("Error in updateMenu", error);
  }
};

export const updateOption = async (id, data) => {
  try {
    const res = await storeApi(`/api/v1/store/options/${id}`, "put", data);
    return res.data;
  } catch (error) {
    // console.error("Error in updateOption", error);
  }
};

export const deleteOption = async (id) => {
  try {
    const res = await storeApi(`/api/v1/store/options/${id}`, "delete");
    return res.data;
  } catch (error) {
    // console.error("Error in deleteOption", error);
  }
};

export const deleteOptionList = async (id) => {
  try {
    const res = await storeApi(`/api/v1/store/option-lists/${id}`, "delete");
    return res.data;
  } catch (error) {
    // console.error("Error in deleteOptionList", error);
  }
};

export const updateOptionListName = async (id, data) => {
  try {
    const res = await storeApi(
      `/api/v1/store/option-lists/${id}/name`,
      "put",
      data
    );
    return res.data;
  } catch (error) {
    // console.error("Error in updateOptionListName", error);
  }
};
