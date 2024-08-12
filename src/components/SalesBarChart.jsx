import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const SalesBarChart = ({ store, selectYear }) => {
  const [chartData, setChartData] = useState([]);

  const getChartData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8083/api/v1/sales-month/store/${store.storeId}/year/${selectYear}`
      );
      console.log(response.data);
      setChartData(response.data);
    } catch (error) {
      console.error("Error in getChartData", error);
    }
  };

  useEffect(() => {
    if (store) {
      getChartData();
    }
  }, [store, selectYear]);

  return (
    <div>
      <BarChart width={window.innerWidth / 1.2} height={300} data={chartData}>
        <XAxis dataKey="month" stroke="#8884d8" />
        <YAxis />
        {/* <Tooltip /> */}
        <Tooltip
          formatter={(value) => `${value.toLocaleString()} 원`}
          labelFormatter={(label) => `${label} 월`}
        />

        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="sales" fill="#fba138" barSize={30} fillOpacity={0.8} />
      </BarChart>
    </div>
  );
};
export default SalesBarChart;
