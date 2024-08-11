import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SelectYears.css";

const SelectYears = ({ store, selectYear, setSelectYear }) => {
  const [years, setYears] = useState([]);

  const handleSelect = (e) => {
    setSelectYear(e.target.value);
  };

  const getYears = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/api/v1/sales-month/store/${store.storeId}/years`
      );
      console.log(response.data);
      setYears(response.data);
      // 가장 첫번째 년도의 그래프를 디폴트 값으로
      setSelectYear(response.data[0]);
    } catch (error) {
      console.error("Error in getYears", error);
    }
  };

  useEffect(() => {
    if (store) {
      getYears();
    }
  }, [store]);

  return (
    <div>
      <select
        className="select-years-box"
        onChange={handleSelect}
        value={selectYear}
      >
        {years ? (
          years.map((item) => {
            return (
              <option value={item} key={item}>
                {item}년
              </option>
            );
          })
        ) : (
          <div>매출이 없습니다.</div>
        )}
      </select>
    </div>
  );
};
export default SelectYears;
