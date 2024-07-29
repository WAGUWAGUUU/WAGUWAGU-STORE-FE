import axios from "axios";


// 주소로 위, 경도 정보 가져오기 with kakao api
export const getAddressDetail = async (address) => {
    const res = await axios.get("https://dapi.kakao.com/v2/local/search/address.JSON"
    , {headers : {Authorization: "KakaoAK 74b51e0ee741798daeac1fce607512b2"}, params: {query : address}})
    console.log(res);
    return res.data;
};


// export const getAddressDetail = async () => {
//     const res = await api("https://business.juso.go.kr/addrlink/addrLinkUrl.do", "post", 
//     {confmKey: "devU01TX0FVVEgyMDI0MDcyNDE0NDMxMjExNDk1NzI=", returnUrl: "http://localhost:5173/mystore"});
//     console.log(res);
//     return res;
// }