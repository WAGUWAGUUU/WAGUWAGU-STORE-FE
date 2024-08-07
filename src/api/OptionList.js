import { api } from "../config/network";

export const saveOptionList = async (optionListRequest) => {
    await api("/api/v1/option-lists/revised", "post", optionListRequest);
}

export const saveOptionListAndOptions = async (data) => {
    try {
        const response = await api("/api/v1/option-lists", "post", data);

        if (response.status === 201) {
            return response.data;
        } else {
            console.error("예상치 못한 응답 상태:", response.status);
            throw new Error("예상치 못한 응답 상태");
        }
    } catch (error) {
        console.error("saveOptionListAndOptions 에러:", error.message);
        throw error;
    }
};

export const  getOptionListByMenuId = async (menuId) => {
    try {
        const res = await api(`/api/v1/option-lists/menu/${menuId}/revised`, "get");
        console.log(res.data, "옵션 리스트");
        return res.data ;
    } catch(e) {
        console.log("getOptionListByMenuId", e);
        return [];
    }
}

export const getOptionListsByStoreId = async (storeId) => {
    try {
        const res = await api(`/api/v1/option-lists/store/${storeId}`, "get");
        console.log(res.data, "옵션 리스트");
        return res.data ;
    } catch(e) {
        console.log("getOptionListByMenuId", e);
        return [];
    }
}