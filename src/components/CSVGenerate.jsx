import axios from "axios";
import React, { useEffect, useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import "./SelectYears.css";

const CSVGenerate = ({ store, selectYear }) => {
  const [cSVData, setCSVData] = useState([]);

  const getCSVData = async () => {
    try {
      const response = await axios.get(
        `https://waguwagu.shop/api/v1/sales/sales-month/store/${store.storeId}/year/${selectYear}`
      );
      console.log("csv" + response.data);
      const modifiedData = changeCSVData(response.data);
      setCSVData(modifiedData);
    } catch (error) {
      console.error("Error in getCSVData", error);
    }
  };

  const changeCSVData = (data) => {
    return data.map((d) => ({
      ...d,
      sales: d.sales + "원",
      month: d.month + "월",
    }));
  };

  useEffect(() => {
    if (store) {
      getCSVData();
    }
  }, [store, selectYear]);

  return (
    <div style={{ marginRight: "20px" }}>
      <CSVLink
        data={cSVData}
        filename={`waguwagu-monthly-sales-${selectYear}.csv`}
      >
        <button
          className="select-years-box"
          style={{
            backgroundColor: "#fba138",
            color: "#FFFFFF",
            padding: "5px",
          }}
        >
          엑셀 다운로드
        </button>
      </CSVLink>
    </div>
  );
};
export default CSVGenerate;
