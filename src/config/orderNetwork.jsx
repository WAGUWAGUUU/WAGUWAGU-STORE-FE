import axios from "axios";
export const orderApi = async (url, method, body, params, headers = {}) => {
  try {
    const res = await axios({
      url,
      method,
      // baseURL: "http://192.168.0.20:8080/api/v1/order",
      baseURL: "http://35.223.83.225:8080/api/v1/order",
      data: body,
      params: params,
      headers: headers,
    });
    return res.data;
  } catch (error) {
    console.error(`Error in ${method} request to ${url}`, error);
    throw error;
  }
};
