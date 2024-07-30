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
  
export const selectByDate = async (requestId, startDate, endDate, pageNumber) => {

  try {
    const url = `/${requestId}/history`;
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
    console.error('Error in selectByDate:', error);
    throw error;
  }
};



export const updateState = async (orderId, data) => {
  console.log('서버 전달하는 orderId : ' + orderId);
  try {
    return await orderApi(
      `/request/${orderId}`,
      "POST",
      data
    );
    return res.data;
  } catch (error) {
  }
};
