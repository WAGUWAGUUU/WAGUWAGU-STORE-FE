import axios from "axios";

export const api = async (url, method, body) => {
  axios.defaults.baseURL = "http://34.41.123.200";
  try {
    const res = await axios({
      url,
      method,
      data: body,
      headers: {
        // Authorization: `jwt ${localStorage.getItem("token")}`,
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
