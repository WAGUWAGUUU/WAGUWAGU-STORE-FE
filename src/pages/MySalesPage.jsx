import React, { useEffect, useState } from "react";
import SalesBarChart from "../components/SalesBarChart";
import SelectYears from "../components/SelectYears";
import SalesPerDay from "../components/SalesPerDay";
const data = [{ name: "Page A", uv: 400 }];

const MySalesPage = () => {
  const [store, setStore] = useState(null);
  const [selectYear, setSelectYear] = useState("");

  const getStore = async () => {
    // const ownerId = localStorage.getItem("ownerId");
    // const res = await getStoreByOwnerIdQL({ ownerId: ownerId });

    setStore({ storeId: 1, storeName: "storeTest" });
  };

  useEffect(() => {
    getStore();
  }, []);

  return (
    <div>
      <SelectYears
        store={store}
        selectYear={selectYear}
        setSelectYear={setSelectYear}
      />
      <SalesBarChart store={store} selectYear={selectYear} />
      <SalesPerDay store={store} year={selectYear} setYear={setSelectYear} />
    </div>
  );
};
export default MySalesPage;
