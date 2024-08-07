import React, { useEffect, useState } from "react";
import ShowMenuList from "../components/ShowMenuList";
import ShowMenuDetail from "../components/ShowMenuDetail";
import { getStoreByOwnerId } from "../config/storeApi";

import { useQuery } from "@apollo/client";
import { GET_STORE_BY_OWNERID } from "../config/storeRoles.jsx";

const MyMenuPage = () => {
  const [store, setStore] = useState(null);
  const [menu, setMenu] = useState(null);
  const [onMenuInfoModal, setOnMenuInfoModal] = useState(false);
  const [menuDetailChange, setMenuDetailChange] = useState(false);
  const { data, loading, error } = useQuery(GET_STORE_BY_OWNERID, {
    variables: { ownerId: localStorage.getItem("ownerId") },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log("Data" + data.getStoreByOwnerId);

  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <ShowMenuList
        store={data.getStoreByOwnerId}
        setMenu={setMenu}
        onMenuInfoModal={onMenuInfoModal}
        menuDetailChange={menuDetailChange}
      />
      <ShowMenuDetail
        menu={menu}
        setMenu={setMenu}
        onMenuInfoModal={onMenuInfoModal}
        setOnMenuInfoModal={setOnMenuInfoModal}
        menuDetailChange={menuDetailChange}
        setMenuDetailChange={setMenuDetailChange}
      />
    </div>
  );
};
export default MyMenuPage;
