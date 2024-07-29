import axios from "axios";

export const api = async (url, method, body, params, headers) => {
  const res = await axios({
    url,
    method,
    baseURL: "http://localhost:8080", // baseURL
    data: body,
    params: params,
    headers: {
      Authorization: "",
    },
  });
  return res;
};
