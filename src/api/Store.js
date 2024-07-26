import { api } from "../config/network";

// store 등록
export const saveStore = async (storeInfo) => {
    await api("/api/v1/store", "post", storeInfo);
}

// ownerId로 store 객체 가져오기
export const getStoreByOwnerId = async (ownerId) => {
    const res = await api(`/api/v1/store/owner/${ownerId}`, "get");
    console.log(res.data);
    return res.data;
}
