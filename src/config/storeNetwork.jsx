import axios from "axios";
export const storeApi = async (url, method, body, params) => {
  const res = await axios({
    url,
    method,
    baseURL: "http://34.27.247.61:8080", // baseURL
    data: body,
    params: params,
    //   headers: {
    //     Authorization: getToken(),
    //   },
  });

  return res;
};
