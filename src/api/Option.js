import { api } from "../config/network";

export const saveOption = async (optionListId, optionRequest) => {
    await api(`/api/v1/options/list/${optionListId}`, "post", optionRequest);
}