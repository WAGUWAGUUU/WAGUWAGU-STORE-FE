import React, { useEffect, useState } from "react";
import SalesBarChart from "../components/SalesBarChart";
import SelectYears from "../components/SelectYears";
import SalesPerDay from "../components/SalesPerDay";
import CSVGenerate from "../components/CSVGenerate";
import { selectByStoreDateAll } from "../config/orderApi";

const MySalesPage = () => {
  const [store, setStore] = useState(null);
  const [selectYear, setSelectYear] = useState("");
  
  const historiesAll = async () => {
    try {
      const data = await selectByStoreDateAll(requestId, firstDateTimestamp, secondDateTimestamp);
      console.log(data);
    } catch (error) {
      console.error('Error fetching more data:', error);
    }
  };

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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <SelectYears
          store={store}
          selectYear={selectYear}
          setSelectYear={setSelectYear}
        />
        <CSVGenerate store={store} selectYear={selectYear} />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <SalesBarChart store={store} selectYear={selectYear} />
      </div>

      <SalesPerDay store={store} year={selectYear} setYear={setSelectYear} />
    </div>
  );
};
export default MySalesPage;
