import React, { useState, useEffect } from "react";
import "./HistoryInquiry.css";
import StatusBox from "../components/StatusBox";
import { selectByStoreDate } from "../config/orderApi";
import { useNavigate } from "react-router-dom";

const HistoryInquiry = () => {
  const [histories, setHistories] = useState([]);
  const [selectedFirstDate, setSelectedFirstDate] = useState("");
  const [selectedSecondDate, setSelectedSecondDate] = useState("");
  const [requestId, setRequestId] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const navigator = useNavigate();

  const statusCounts = histories.reduce((counts, history) => {
    counts[history.status] = (counts[history.status] || 0) + 1;
    return counts;
  }, {});

  const handleFirstDateChange = (event) => {
    setSelectedFirstDate(event.target.value);
  };

  const handleSecondDateChange = (event) => {
    setSelectedSecondDate(event.target.value);
  };

  const handleRequestIdChange = (event) => {
    setRequestId(event.target.value);
  };

  const toggleDateInput = () => {
    setShowDateInput((prevShowDateInput) => !prevShowDateInput);
  };

  const formatDateForTimestamp = (date) => {
    if (!date) return "";
    return new Date(`${date}T00:00:00`).getTime();
  };

  const handleInquiry = async () => {
    try {
      setPageNumber(0);

      const firstDateTimestamp = formatDateForTimestamp(selectedFirstDate);
      const secondDateTimestamp = formatDateForTimestamp(selectedSecondDate);

      const data = await selectByStoreDate(
        requestId,
        firstDateTimestamp,
        secondDateTimestamp,
        0
      );
      setHistories(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadMoreHistories = async () => {
    try {
      const newPageNumber = pageNumber + 1;

      const firstDateTimestamp = formatDateForTimestamp(selectedFirstDate);
      const secondDateTimestamp = formatDateForTimestamp(selectedSecondDate);

      const data = await selectByStoreDate(
        requestId,
        firstDateTimestamp,
        secondDateTimestamp,
        newPageNumber
      );
      setHistories((prevHistories) => [...prevHistories, ...data]);
      setPageNumber(newPageNumber);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    loadMoreHistories();
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedFirstDate, selectedSecondDate, pageNumber, requestId]);

  const formatDate = (date) => {
    if (!date) return { year: "", month: "", day: "" };
    const [year, month, day] = date.split("-");
    return { year, month, day };
  };

  const firstDate = formatDate(selectedFirstDate);
  const secondDate = formatDate(selectedSecondDate);

  return (
    <div className="history-inquiry">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="date-range">
          <div className="date-box">{firstDate.year}</div>
          <div className="date-box">{firstDate.month}</div>
          <div className="date-box">{firstDate.day}</div>
          <div className="date-separator">-</div>
          <div className="date-box">{secondDate.year}</div>
          <div className="date-box">{secondDate.month}</div>
          <div className="date-box">{secondDate.day}</div>
          <button className="inquiry-button" onClick={handleInquiry}>
            조회
          </button>
          <button className="inquiry-button" onClick={toggleDateInput}>
            날짜설정
          </button>
        </div>
        <button
          className="go-sales-button"
          onClick={() => {
            navigator(`/my-sales`);
          }}
        >
          총 매출 확인
        </button>
      </div>

      {showDateInput && (
        <div className="date-input-container">
          <input
            type="date"
            id="firstDateInput"
            value={selectedFirstDate}
            onChange={handleFirstDateChange}
          />
          <input
            type="date"
            id="secondDateInput"
            value={selectedSecondDate}
            onChange={handleSecondDateChange}
          />
          <input
            type="text"
            id="requestIdInput"
            placeholder="Request ID"
            value={requestId}
            onChange={handleRequestIdChange}
          />
        </div>
      )}

      <div className="order-summary">
        <StatusBox
          status="배달 완료건"
          count={`${statusCounts["배달 완료"] || 0}`}
        />
        <StatusBox
          status="주문 취소건"
          count={`${statusCounts["주문 취소"] || 0}`}
        />
        <StatusBox
          status="금액 통계"
          count={`${statusCounts["금액 통계"] || 0}`}
        />
        <StatusBox
          status="배달 수수료"
          count={`${statusCounts["배달 수수료"] || 0}`}
        />
        <StatusBox
          status="기타 등등"
          count={`${statusCounts["기타 등등"] || 0}`}
        />
      </div>

      <div className="history-details">
        {histories.map((history) => (
          <div key={history.id} className="history-box">
            <div className="history-status">{history.status}</div>
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
    </div>
  );
};

export default HistoryInquiry;
