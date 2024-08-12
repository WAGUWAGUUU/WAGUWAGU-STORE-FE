import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SelectYears.css";

const SalesPerDay = ({ store }) => {
  const currentDate = new Date();
  const [year, setYear] = useState(
    currentDate.getMonth() === 0
      ? currentDate.getFullYear() - 1
      : currentDate.getFullYear()
  );
  const [month, setMonth] = useState(
    currentDate.getMonth() === 0 ? 12 : currentDate.getMonth()
  );
  const [showYears, setShowYears] = useState([]);
  const showMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [data, setData] = useState([]);

  const setYearsData = () => {
    const year = new Date().getFullYear();
    const years = [year, year - 1, year - 2, year - 3, year - 4];
    setShowYears(years);
    console.log(years);
  };

  const handleSelectYear = (e) => {
    setYear(e.target.value);
  };

  const handleSelectMonth = (e) => {
    setMonth(e.target.value);
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/api/v1/sales-day/store/${store.storeId}/${year}/${month}`
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error in getData", error);
    }
  };

  useEffect(() => {
    if (store) {
      setYearsData();
      getData();
    }
  }, [store, year, month]);

  return (
    <div>
      <select
        className="select-years-box"
        onChange={handleSelectYear}
        value={year}
      >
        {showYears.map((item) => {
          return (
            <option value={item} key={item}>
              {item}년
            </option>
          );
        })}
      </select>

      <select
        className="select-years-box"
        onChange={handleSelectMonth}
        value={month}
      >
        {showMonths.map((item) => {
          return (
            <option value={item} key={item}>
              {item}월
            </option>
          );
        })}
      </select>
      {data && data.length > 0 ? (
        data.map((item) => {
          return (
            <div value={item.date} key={item.date}>
              {item.date}
              <br />
              {item.sales}
            </div>
          );
        })
      ) : (
        <div>매출이 없습니다.</div>
      )}
    </div>
  );
};
export default SalesPerDay;
