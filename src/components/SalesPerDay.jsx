import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import "./SelectYears.css";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import styled from "styled-components";
import { selectByStoreDate, selectByStoreDateAll } from "../config/orderApi";

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
  const [showDailySalesData, setShowDailySalesData] = useState([]);

  const setYearsData = () => {
    const year = new Date().getFullYear();
    const years = [year, year - 1, year - 2, year - 3, year - 4];
    setShowYears(years);
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
        `http://34.69.39.99/api/v1/sales/sales-day/store/${store.storeId}/${year}/${month}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error in getData", error);
    }
  };

  // react-table
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("date", { header: "날짜" }),
    columnHelper.accessor("sales", { header: "하루 총 매출" }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  const isNoData = getRowModel().rows.length === 0;

  const formatDateForTimestamp = (date) => {
    if (!date) return "";

    // date가 이미 Date 객체인 경우
    if (date instanceof Date) {
      return date.setHours(0, 0, 0, 0);
    }

    // date가 문자열인 경우
    if (typeof date === "string") {
      // YYYY-MM-DD 형식인지 확인
      const parts = date.split("-");
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.setHours(0, 0, 0, 0);
      }
    }

    // 그 외의 경우, 현재 날짜의 시작을 반환
    return new Date().setHours(0, 0, 0, 0);
  };

  const showDailySales = async (date) => {
    // const selectedDate = new Date(date);
    const timestamp = formatDateForTimestamp(date);
    try {
      const data = await selectByStoreDateAll(
        store.storeId,
        timestamp,
        timestamp
      );
      console.log(data);
      setShowDailySalesData(data);
    } catch (error) {
      console.error("Error fetching showDailySales data:", error);
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
        {showYears.map((item) => (
          <option value={item} key={item}>
            {item}년
          </option>
        ))}
      </select>

      <select
        className="select-years-box"
        onChange={handleSelectMonth}
        value={month}
      >
        {showMonths.map((item) => (
          <option value={item} key={item}>
            {item}월
          </option>
        ))}
      </select>

      <TableContainer>
        {getHeaderGroups().map((headerGroup) => (
          <TableHeader className="row" key={headerGroup.id}>
            {headerGroup.headers.map((header) =>
              header.isPlaceholder ? null : (
                <TableCell key={header.id} width={header.column.getSize()}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              )
            )}
          </TableHeader>
        ))}
        <TableBody useMinHeight={isNoData ? 1 : 0}>
          {isNoData ? (
            <div style={{ fontSize: "50px" }}>텅!</div>
          ) : (
            getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow className="row">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      width={cell.column.getSize()}
                      onClick={() => showDailySales(cell.row.original.date)} // 수정된 부분
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </Fragment>
            ))
          )}
        </TableBody>
      </TableContainer>

      {showDailySalesData && (
        <div>
          {showDailySalesData.map((history) => (
            <div key={history.id}>
              <div>{history.status}</div>
              <div>주문아이디: {history.id}</div>
              <div>상태: {history.orderState.join(", ")}</div>{" "}
              {/* Display orderState array */}
              <div>고객아이디: {history.customerId}</div>
              <div>메뉴: {history.menu}</div>
              <div>옵션: {history.options}</div>
              <div>고객요청: {history.request}</div>
              <div>고객주소: {history.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesPerDay;

// Styled Components
const TableContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .row {
    width: 100%;
    display: flex;
    border-bottom: 1px solid rgba(224, 224, 224, 1);
  }
`;

const TableCell = styled.div`
  width: ${({ width }) => width}px;
  padding: 16px;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  align-items: center;
  word-break: break-all;
`;

const TableRow = styled.div`
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const TableHeader = styled.div`
  font-weight: 500;
`;

const TableBody = styled.div`
  min-height: ${({ useMinHeight }) => (useMinHeight ? "560px" : "auto")};
  display: flex;
  flex-direction: column;
`;
