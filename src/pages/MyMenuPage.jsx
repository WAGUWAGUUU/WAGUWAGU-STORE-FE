import React, { useEffect, useState } from "react";
import ShowMenuList from "../components/ShowMenuList";
import ShowMenuDetail from "../components/ShowMenuDetail";
import { getStoreByOwnerId } from "../config/storeApi";
const MyMenuPage = () => {
  const [store, setStore] = useState(null);
  const [menu, setMenu] = useState(null);
  const getStoreByOwnerIdApi = async () => {
    try {
      const response = await getStoreByOwnerId(3613397573);
      setStore(response.storeId);
    } catch {
      console.log("error in getStoreByOwnerIdApi");
    }
  };

  useEffect(() => {
    getStoreByOwnerIdApi();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <ShowMenuList store={store} setMenu={setMenu} />
      <ShowMenuDetail menu={menu} />
    </div>
  );
};
export default MyMenuPage;
