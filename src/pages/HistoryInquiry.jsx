import React, { useState, useEffect } from "react";
import "./HistoryInquiry.css";
import StatusBox from "../components/StatusBox";
import { selectByStoreDate } from "../config/orderApi";
import { useNavigate } from "react-router-dom";
import { getStoreByOwnerIdQL } from "../config/storeGraphQL";

const HistoryInquiry = () => {
  const [histories, setHistories] = useState([]);
  const [selectedFirstDate, setSelectedFirstDate] = useState("");
  const [selectedSecondDate, setSelectedSecondDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [ownerId, setOwnerId] = useState("");
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

  const toggleDateInput = () => {
    setShowDateInput((prevShowDateInput) => !prevShowDateInput);
  };

  const getStore = async () => {
    const storedOwnerId = localStorage.getItem("ownerId");
    setOwnerId(storedOwnerId); // Set the ownerId state with the value from localStorage
    try {
      const res = await getStoreByOwnerIdQL({ ownerId: storedOwnerId });
      setStore(res);
    } catch (error) {
      console.error("Failed to fetch store:", error);
    }
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
        ownerId, // Use ownerId instead of requestId
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
        ownerId, // Use ownerId instead of requestId
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
    getStore(); // Fetch store details on component mount
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedFirstDate, selectedSecondDate, pageNumber, ownerId]);

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
        {histories.map((history, index) => (
          <div key={index} className="history-box">
            <div className="history-status">{history.status}</div>
            <div>주문아이디: {history.orderId.timestamp}</div>
            <div>상태: {history.orderState.join(", ")}</div>
            <div>고객아이디: {history.customerId}</div>
            <div>고객주소: {history.customerAddress}</div>
            <div>총 금액: {history.orderTotalPrice}원</div>
            <div>배달 수수료: {history.deliveryFee}원</div>
            <div>거리: {history.distanceFromStoreToCustomer}km</div>
            <div>고객요청: {history.customerRequests || "없음"}</div>

            {history.menuItems && history.menuItems.length > 0 && (
              <div>
                <div>메뉴:</div>
                <ul>
                  {history.menuItems.map((menuItem, idx) => (
                    <li key={idx}>
                      <div>{menuItem.menuName}</div>
                      <div>메뉴 가격: {menuItem.totalPrice}원</div>
                      {menuItem.selectedOptions &&
                      menuItem.selectedOptions.length > 0 ? (
                        <ul>
                          {menuItem.selectedOptions.map((optionList, optIdx) => (
                            <li key={optIdx}>
                              <div>{optionList.listName}:</div>
                              {optionList.options &&
                              optionList.options.length > 0 ? (
                                <ul>
                                  {optionList.options.map((option, oIdx) => (
                                    <li key={oIdx}>
                                      {option.optionTitle} (+{option.optionPrice}원)
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div>옵션 없음</div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>옵션 없음</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryInquiry;
