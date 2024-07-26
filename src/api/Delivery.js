import { api } from "../config/network";

export const saveDeliveryInfo = async (storeId, storeInfo) => {
    await api(`/api/v1/store/${storeId}/store-delivery-info`, "post", storeInfo);
}
