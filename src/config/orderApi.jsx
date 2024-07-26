import { orderApi } from "./orderNetwork";

export const selectByOwner = async (ownerId) => {
    try {
      const res = await orderApi(
        `${ownerId}`,"get");
      return res.data;
    } catch (error) {
      console.error("Error in selectByOwner", error);
    }
  };
  
  export const selectByDate = async (requestId, startDate, endDate) => {
    try {
      const response = await axios.get(`/${requestId}/history`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          startDate,
          endDate,
        },
      });
  
      if (response.status !== 200) {
        throw new Error('selectByDate not ok');
      }
  
      return response.data;
    } catch (error) {
      console.error('Error selectByDate:', error);
      throw error;
    }
  };



export const updateState = async (orderId, status) => {
    try {
      const res = await axios.post(`${orderId}`,{ status });
      return res.data;
    } catch (error) {
      console.error("Error in updateState", error);
    }
  };
