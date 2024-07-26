import { orderApi } from "./orderNetwork";

export const selectByOwner = async (ownerId) => {
  console.log(ownerId);
  try {
    const res = await orderApi(
      `${ownerId}`, // Correctly pass the ownerId in the URL
      "GET" // Ensure the HTTP method is in uppercase
    );
    console.log(res);
    return res;
  } catch (error) {
    console.error("Error in selectByOwner", error);
    throw error; // It's good practice to rethrow the error to let the caller handle it
  }
};
  
export const selectByDate = async (requestId, startDate, endDate, pageNumber) => {
  console.log(requestId);
  console.log(startDate);
  console.log(endDate);
  console.log(pageNumber);


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



  export const updateState = async (orderId, status) => {
    console.log('서버 전달하는 orderId : ' + orderId);
    try {
      return await orderApi(
        `/request/${orderId}`,
        "POST",
        status, // Passing status as a string
        null,
        { 'Content-Type': 'text/plain' } // Ensure the content type is set to plain text
      );
    } catch (error) {
      console.error("Error in updateState", error);
      throw error;
    }
  };
