import { orderApi } from "./orderNetwork";

export const selectByOwner = async (storeId) => {
  console.log(storeId);
  try {
    const res = await orderApi(
      `/store/${storeId}/all`, 
      "GET" 
    );
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error in selectByOwner", error);
    throw error;
  }
};

// export const UserInformation = async () => {
//   try {
//     const res = await orderApi('api/v1/order/userInformation', 'get');
//     return res.data;
//   } catch (error) {
//     console.error('Error in UserInformation ', error);
//     throw error;
//   }
// };



export const selectByStoreDate = async (storeId, startDate, endDate, pageNumber) => {

  try {
    const url = `/${storeId}/history`;
    const method = 'GET';
    const params = {
      startDate,
      endDate,
      pageNumber,
    };

    const data = await orderApi(url, method, null, params, {
      'Content-Type': 'application/json',
    });

    console.log(data);
    return data;
  } catch (error) {
    console.error('Error in selectByStoreDate:', error);
    throw error;
  }
};



export const updateState = async (orderId, data) => {
  console.log('서버 전달하는 orderId : ' + orderId);
  console.log('Update request payload:', data);
  try {
    const response = await orderApi(`/request/${orderId}`, "POST", data);
    return response;
  } catch (error) {
    console.error('Error in updateState:', error.response ? error.response.data : error.message);
    throw error;
  }
};
