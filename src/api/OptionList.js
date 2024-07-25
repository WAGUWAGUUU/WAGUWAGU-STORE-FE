import { api } from "../config/network";

export const saveOptionList = async (optionListRequest) => {
    await api("/api/v1/option-lists/revised", "post", optionListRequest);
}

export const getOptionListByMenuId = async (menuId) => {
   const res = await api(`/api/v1/option-lists/menu/${menuId}/revised`, "get");
   console.log(res.data, "api");
   return res.data;
}