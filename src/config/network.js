import axios from "axios";

export const api = async (url, method, body, params, headers) => {
    const res = await axios({
        url,
        method,
        baseURL: "http://192.168.0.17:8080", // baseURL
        data: body,
        params: params,
        headers: {
            Authorization: ""
        },
    });
    return res;
}
