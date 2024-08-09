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
