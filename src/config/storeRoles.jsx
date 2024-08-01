import { gql } from "@apollo/client";

export const GET_STORE_BY_OWNERID = gql`
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
`;

// export const GET_MENUCATEGORY_BY_STOREID = gql`
//   query getMenuCategoryByStoreId($storeId: ID) {
//     getMenuCategoryByStoreId(storeId: $storeId) {
//       menuCategoryId
//       menuCategoryName
//     }
//   }
// `;

export const GET_ALL_MENU_BY_MENUCATEGORYID = gql`
  query getAllMenuByMenuCategory($menuCategoryId: ID) {
    getAllMenuByMenuCategory(menuCategoryId: $menuCategoryId) {
      menuId
      menuName
      menuIntroduction
      menuPrice
      menuPossible
    }
  }
`;

export const DELETE_MENUCATEGORY = gql`
  mutation deleteMenuCategory($menuCategoryId: ID) {
    deleteMenuCategory(menuCategoryId: $menuCategoryId)
  }
`;
