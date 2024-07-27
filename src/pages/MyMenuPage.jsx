import React, { useEffect, useState } from "react";
import ShowMenuList from "../components/ShowMenuList";
import ShowMenuDetail from "../components/ShowMenuDetail";
import { getStoreByOwnerId } from "../config/storeApi";
const MyMenuPage = () => {
  const [store, setStore] = useState(null);
  const [menu, setMenu] = useState(null);
  const [onMenuInfoModal, setOnMenuInfoModal] = useState(false);

  const getStoreByOwnerIdApi = async () => {
    try {
      // const response = await getStoreByOwnerId(localStorage.getItem("ownerId"));
      const response = await getStoreByOwnerId(2);

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
      <ShowMenuList
        store={store}
        setMenu={setMenu}
        onMenuInfoModal={onMenuInfoModal}
      />
      <ShowMenuDetail
        menu={menu}
        setMenu={setMenu}
        onMenuInfoModal={onMenuInfoModal}
        setOnMenuInfoModal={setOnMenuInfoModal}
      />
    </div>
  );
};
export default MyMenuPage;
