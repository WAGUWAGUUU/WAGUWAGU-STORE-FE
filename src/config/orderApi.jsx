import { orderApi } from "./orderNetwork";

export const selectByOwner = async (storeId) => {
  console.log(storeId);
  try {
    const res = await orderApi(`/store/${storeId}/all`, "GET");
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

export const selectByStoreDateAll = async (storeId, startDate, endDate) => {
  try {
    const data = await orderApi(
      `/${storeId}/history/all`,
      "GET",
      null,
      {
        startDate,
        endDate,
        // offset,
      },
      {
        "Content-Type": "application/json",
      }
    );

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error in selectByStoreDate:", error);
    throw error;
  }
};

export const selectByStoreDate = async (
  storeId,
  startDate,
  endDate,
  offset
) => {
  try {
    const data = await orderApi(
      `/${storeId}/history`,
      "GET",
      null,
      {
        startDate,
        endDate,
        offset,
      },
      {
        "Content-Type": "application/json",
      }
    );

    console.log(data);
    return data;
  } catch (error) {
    console.error("Error in selectByStoreDate:", error);
    throw error;
  }
};

export const updateState = async (orderId, data) => {
  try {
    const response = await orderApi(`/request/${orderId}`, "POST", data);
    return response;
  } catch (error) {
    console.error(
      "Error in updateState:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
