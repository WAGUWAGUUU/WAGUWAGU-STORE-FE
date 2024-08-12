import axios from "axios";
const endpoint = "http://34.69.39.99/graphql";

export const getStoreByOwnerIdQL = async (variables) => {
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
    return data.status === 200 ? data.data.data.getStoreByOwnerId : "error";
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
              menuImage
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
              menuImage
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

// MyStore.jsx

export const saveStoreQL = async (variables) => {
  try {
    const response = await axios.post(
      endpoint,
      {
        query: `
                mutation createStore($input: StoreRequestDto) {
                  createStore(input: $input)
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
    console.log(response)
    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error("해당 메뉴 카테고리는 이미 존재합니다");
    } else {
      throw new Error("메뉴 카테고리를 저장하는 중에 오류가 발생했습니다");
    }
  }
};

export const deleteStoreByIdQL = async (variables) => {
  try {
    await axios.post(
      endpoint,
      {
        query: `
              mutation deleteStore($storeId: ID) {
                deleteStore(storeId: $storeId)
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

export const updateStoreByIdQL = async (variables) => {
  try {
    await axios.post(
      endpoint,
      {
        query: `
                mutation updateStoreInfo($storeId: ID,$input: StoreUpdateRequest) {
                  updateStoreInfo(storeId: $storeId,input: $input)
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

export const saveDeliveryInfoQL = async (variables) => {
  try {
    await axios.post(
      endpoint,
      {
        query: `
                  mutation createStoreDeliveryInfo($storeId: ID,$input: StoreDeliveryInfoRequestDto) {
                    createStoreDeliveryInfo(storeId: $storeId,input: $input)
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

export const updateDeliveryInfoQL = async (variables) => {
  try {
    await axios.post(
      endpoint,
      {
        query: `
                  mutation updateStoreDeliveryInfo($storeId: ID,$input: StoreDeliveryInfoRequestDto) {
                    updateStoreDeliveryInfo(storeId: $storeId,input: $input)
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

export const getDeliveryInfoQL = async (variables) => {
  try {
    console.log("getDelvierInfo 들어옴");
    const data = await axios.post(
      endpoint,
      {
        query: `
            query getStoreDeliveryInfoAllByStoreId($storeId: ID) {
              getStoreDeliveryInfoAllByStoreId(storeId: $storeId) {
                storeDeliveryInfoState
                storeDeliveryInfoFee
                storeDeliveryInfoDistanceEnd
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
    console.log(
      "getDeliveryInfoQL : " +
        data.data.data.getStoreDeliveryInfoAllByStoreId.storeDeliveryInfoState
    );
    return data.status === 200
      ? data.data.data.getStoreDeliveryInfoAllByStoreId
      : null;
  } catch (error) {
    return error;
  }
};

// Menu.jsx

export const saveMenuCategoryQL = async (variables) => {
  try {
    const response = await axios.post(
      endpoint,
      {
        query: `
                  mutation createMenuCategory($input: MenuCategoryRequestDto) {
                    createMenuCategory(input: $input)
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
    console.log(response)
    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error("해당 메뉴 카테고리는 이미 존재합니다");
    } else {
      throw new Error("메뉴 카테고리를 저장하는 중에 오류가 발생했습니다");
    }
  }
};
  

export const saveMenuQL = async (variables) => {
  try {
    const response = await axios.post(
      endpoint,
      {
        query: `
                  mutation createMenu($input: MenuRequestDto) {
                    createMenu(input: $input)
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
    console.log(response)
    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error("해당 메뉴 카테고리는 이미 존재합니다");
    } else {
      throw new Error("메뉴 카테고리를 저장하는 중에 오류가 발생했습니다");
    }
  }
};

// blockIsOpened

export const blockStoreIsOpenedQL = async (variables) => {
  try {
    await axios.post(
      endpoint,
      {
        query: `
              mutation blockStoreIsOpened($storeId: ID) {
                blockStoreIsOpened(storeId: $storeId)
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

export const checkBlockStoreIsOpenedQL = async (variables) => {
  try {
    const data = await axios.post(
      endpoint,
      {
        query: `
            query checkBlockStoreIsOpened($storeId: ID) {
              checkBlockStoreIsOpened(storeId: $storeId)
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

    return data.status === 200 ? data.data.data.checkBlockStoreIsOpened : null;
  } catch (error) {
    return error;
  }
};
