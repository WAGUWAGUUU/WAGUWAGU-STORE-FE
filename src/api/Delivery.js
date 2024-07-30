import { api } from "../config/network";

export const saveDeliveryInfo = async (storeId, storeInfo) => {
    await api(`/api/v1/store/${storeId}/store-delivery-info`, "post", storeInfo);
}

export const getDeliveryInfo = async (storeId) => {
   const res = await api(`/api/v1/store/${storeId}/store-delivery-info`, "get");
   console.log(res.data);
   return res.data;
}

export const updateDeliveryInfo = async (storeId, updateInfo) => {
    await api(`/api/v1/store/${storeId}/store-delivery-info`, "put", updateInfo);
}
