import {api} from "./AuthNetwork.jsx";

export const getInfo = async (data) => {
  const res = await api("/api/v1/auth/owners", "get",data);
  return res;
};
export const updateInfo = async (data) => {
  const res = await api("/api/v1/auth/owners", "put",data);
  return res;
};

export const getToken = async (data) => {
  const res = await api("/api/v1/auth/owners/callback?code="+data, "get",data);
  return res;
};