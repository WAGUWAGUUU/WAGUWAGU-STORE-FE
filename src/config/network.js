import axios from "axios";

export const api = async (url, method, body, params, headers) => {
  const res = await axios({
    url,
    method,
    // baseURL: "http://192.168.0.17:8080", // baseURL
    // baseURL: "http://192.168.0.15:8090", // baseURL
    baseURL: "http://34.41.123.200", // baseURL
    data: body,
    params: params,
    headers: {
      Authorization: "",
    },
  });
  return res;
};
