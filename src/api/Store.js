import { api } from "../config/network";

// store 등록
export const saveStore = async (storeInfo) => {
  await api("/api/v1/store", "post", storeInfo);
};

// ownerId로 store 객체 가져오기
export const getStoreByOwnerId = async (ownerId) => {
  const res = await api(`/api/v1/store/owner/${ownerId}`, "get");
  console.log(res.data);
  return res.data;
};

// storeId로 store 객체 삭제
export const deleteStoreById = async (id) => {
  await api(`/api/v1/store/${id}`, "delete");
};

// storeId로 store 객체 업데이트
export const updateStoreById = async (id, updateInfo) => {
  await api(`/api/v1/store/${id}`, "put", updateInfo);
};
