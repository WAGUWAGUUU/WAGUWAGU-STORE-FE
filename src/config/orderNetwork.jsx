import axios from "axios";
export const orderApi = async (url, method, body, params) => {
  const res = await axios({
    url,
    method,
    baseURL: "http://localhost:8080/api/v1/order",
    data: body,
    params: params,
    //   headers: {
    //     Authorization: getToken(),
    //   },
  });

  return res;
};
