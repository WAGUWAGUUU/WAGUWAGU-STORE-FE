import axios from "axios";
const endpoint = "http://192.168.0.17:8080/graphql";

export const GET_STORE_BY_OWNERID = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
          query getStoreByOwnerId($ownerId: ID) {
            getStoreByOwnerId(ownerId: $ownerId) {
              storeId
              storeName
              storeAddress
              storeLongitude
              storeLatitude
              storeOpenAt
              storeCloseAt
              storePhone
              storeMinimumOrderAmount
              storeIntroduction
              storeCategory
            }
          }
        `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.status === 200
      ? data.data.data.getMenuCategoryByStoreId
      : "error";
  } catch (error) {
    return error;
  }
};

export const getMenuCategoryByStoreQL = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
          query getMenuCategoryByStoreId($storeId: ID) {
            getMenuCategoryByStoreId(storeId: $storeId) {
              menuCategoryId
              menuCategoryName
            }
          }
        `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("데이터 확인" + data.data.data.getMenuCategoryByStoreId);
    return data.status === 200
      ? data.data.data.getMenuCategoryByStoreId
      : "error";
  } catch (error) {
    return error;
  }
};

export const getMenuByMenuCategoryQL = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
          query getAllMenuByMenuCategory($menuCategoryId: ID) {
            getAllMenuByMenuCategory(menuCategoryId: $menuCategoryId) {
              menuId
              menuName
              menuIntroduction
              menuPrice
              menuPossible
            }
          }
        `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.status === 200
      ? data.data.data.getAllMenuByMenuCategory
      : "error";
  } catch (error) {
    return error;
  }
};

export const deleteMenuCategoryQL = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
          mutation deleteMenuCategory($menuCategoryId: ID) {
            deleteMenuCategory(menuCategoryId: $menuCategoryId)
          }
        `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.status === 200 ? data.data.data.deleteMenuCategory : "error";
  } catch (error) {
    return error;
  }
};

// showMenuDetail.jsx

export const getMenuByMenuIdQL = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
          query getMenuById($menuId: ID) {
            getMenuById(menuId: $menuId) {
              menuId
              menuName
              menuIntroduction
              menuPrice
              menuPossible
            }
          }
        `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.status === 200 ? data.data.data.getMenuById : "error";
  } catch (error) {
    return error;
  }
};

export const changeMenuPossibleQL = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
            query changeMenuPossible($menuId: ID) {
              changeMenuPossible(menuId: $menuId)
            }
          `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.status === 200 ? data.data.data.changeMenuPossible : "error";
  } catch (error) {
    return error;
  }
};

export const deleteMenuQL = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
            mutation deleteMenu($menuId: ID) {
              deleteMenu(menuId: $menuId)
            }
          `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.status === 200 ? data.data.data.menuId : "error";
  } catch (error) {
    return error;
  }
};

// menucategoryInfoModal

export const updateMenuCategoryNameQL = async (variables) => {
  try {
    await axios.post(
      endpoint,
      {
        query: `
            mutation updateMenuCategoryName($menuCategoryId: ID,$input: UpdateMenuCategoryRequestDto) {
              updateMenuCategoryName(menuCategoryId: $menuCategoryId,input: $input)
            }
          `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return error;
  }
};

// menuInfoModal

export const updateMenuQL = async (variables) => {
  try {
    await axios.post(
      endpoint,
      {
        query: `
              mutation updateMenu($menuId: ID,$input: UpdateMenuRequestDto) {
                updateMenu(menuId: $menuId,input: $input)
              }
            `,
        variables: variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return error;
  }
};
