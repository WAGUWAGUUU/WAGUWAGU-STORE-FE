import React, { useEffect, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import moment from "moment-timezone";
import "../components/OrderAlarmBox.css";
import "./OrderNotification.css";
import StatusBox from "../components/StatusBox";
import OrderAlarmBox from "../components/OrderAlarmBox";
import { updateState, selectByOwner } from "../config/orderApi";
import { getStoreByOwnerIdQL } from "../config/storeGraphQL";
import Lottie from "lottie-react";
import loadingLottie from "../assets/Animation - 1724243583826.json";

const OrderNotification = () => {
  const [ownerId, setOwnerId] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [minutes, setMinutes] = useState("");
  const [showDueTimeInput, setShowDueTimeInput] = useState(false);
  const [dueTimeInputPosition, setDueTimeInputPosition] = useState({
    top: 0,
    left: 0,
  });
  const [statusCounts, setStatusCounts] = useState({
    "주문 요청": 0,
    조리중: 0,
    "배달 요청": 0,
    "배달 수락": 0,
    배달중: 0,
    "배달 완료": 0,
  });
  const dropdownRef = useRef(null);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const [store, setStore] = useState([]);

  const getStore = async () => {
    const ownerId = localStorage.getItem("ownerId");
    try {
      const res = await getStoreByOwnerIdQL({ ownerId });
      setStore(res);
    } catch (error) {
      console.error("Failed to fetch store:", error);
    }
  };

  const fetchOrders = async (ownerId) => {
    if (!ownerId) {
      console.log("Owner ID is not set.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`요청하는 가게 ${ownerId}`);
      const response = await selectByOwner(ownerId);
      console.log("Fetched data:", response);
      if (Array.isArray(response)) {
        const processedOrders = response.map((order) => ({
          ...order,
          status: order.orderState[order.orderState.length - 1],
        }));
        setOrders(processedOrders);
      } else {
        console.error("Response is not an array:", response);
        setOrders([]);
      }
    } catch (error) {
      console.error("OrderNotification 에러", error);
      setError("An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrders = () => {
    fetchOrders(store.storeId);
  };

  const handleStatusChange = async (
    orderId,
    newStatus,
    customDueTime = null
  ) => {
    let dueTime = customDueTime;

    if (!dueTime && newStatus === "배달 요청") {
      const now = moment().tz("Asia/Seoul");
      dueTime = now
        .clone()
        .add(parseInt(minutes, 10), "minutes")
        .tz("Asia/Seoul")
        .valueOf();
    }

    const updateRequest = {
      status: newStatus,
      riderId: null,
      due: dueTime,
    };

    console.log("Update request payload:", updateRequest);

    try {
      const response = await updateState(orderId, updateRequest);
      console.log("Update response:", response);
      setOrders(
        orders.map((order) => {
          if (order.id === orderId || order.orderId === orderId) {
            return { ...order, status: newStatus, due: dueTime };
          }
          return order;
        })
      );
    } catch (error) {
      console.error(
        "Error updating order status:",
        error.response ? error.response.data : error.message
      );
    }

    setSelectedOrder(null);
    setShowDueTimeInput(false);
  };

  const handleOrderClick = (event, status, orderId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 150;
    const dropdownHeight = 200;
    let top = rect.bottom + window.scrollY;
    let left = rect.left + window.scrollX;

    if (left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 10;
    }

    if (top + dropdownHeight > window.innerHeight) {
      top = rect.top + window.scrollY - dropdownHeight;
    }

    setDropdownPosition({ top, left });
    setSelectedOrder(orderId);
    console.log(`Dropdown position set to top: ${top}, left: ${left}`);
  };

  useEffect(() => {
    console.log("Selected order has been updated:", selectedOrder);
    getStore();
  }, [selectedOrder]);

  useEffect(() => {
    // Calculate the status counts whenever the orders array changes
    const statuses = orders.map((order) => order.status);

    const newStatusCounts = {
      "주문 요청": statuses.filter((status) => status === "주문 요청").length,
      조리중: statuses.filter((status) => status === "조리중").length,
      "배달 요청": statuses.filter((status) => status === "배달 요청").length,
      "배달 수락": statuses.filter((status) => status === "배달 수락").length,
      배달중: statuses.filter((status) => status === "배달중").length,
      "배달 완료": statuses.filter((status) => status === "배달 완료").length,
    };

    setStatusCounts(newStatusCounts);
  }, [orders]);

  useEffect(() => {
    // Fetch orders every 5 seconds
    const intervalId = setInterval(() => {
      fetchOrders(store.storeId);
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [store.storeId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "배달 요청":
        return "#2B6DEF";
      case "배달 수락":
        return "#F3DD0F";
      case "조리중":
        return "#EECAD5";
      case "주문 요청":
        return "#E55959";
      case "배달중":
        return "#6E5656";
      case "배달 완료":
        return "#808080";
      default:
        return "#ffffff";
    }
  };

  if (loading) {
    return (
        <div style={{height: "500px"}}>
          <Lottie animationData={loadingLottie} style={{height: "250px"}}/>
        </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
      <div className="order-notification">
        <div className="input-box">
        <button onClick={handleFetchOrders}>조회하기</button>
      </div>
      <div className="date">
        <div className="date-box">{year}</div>
        <div className="date-box">{month}</div>
        <div className="date-box">{day}</div>
      </div>
      <div className="order-summary">
        <StatusBox status="주문 요청" count={statusCounts["주문 요청"]} />
        <StatusBox status="조리중" count={statusCounts["조리중"]} />
        <StatusBox status="배달 요청" count={statusCounts["배달 요청"]} />
        <StatusBox status="배달 수락" count={statusCounts["배달 수락"]} />
        <StatusBox status="배달중" count={statusCounts["배달중"]} />
        <StatusBox status="배달 완료" count={statusCounts["배달 완료"]} />
      </div>
      <div className="order-details">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderAlarmBox
              key={order.orderId}
              orderNumber={order.orderId}
              status={order.status}
              statusColor={getStatusColor(order.status)}
              customerId={order.customerId}
              menu={order.menuItems}
              options={order.options}
              customerRequests={order.customerRequests}
              customerAddress={order.customerAddress}
              estimatedTime={order.estimatedTime}
              dau={order.due}
              onStatusClick={handleOrderClick}
              backgroundColor={getStatusColor(order.status)}
            />
          ))
        ) : (
          <div>No orders available</div>
        )}
      </div>
      {selectedOrder && (
        <div
          className="status-dropdown"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          ref={dropdownRef}
        >
          {statusOptions.map((status) => (
            <div
              key={status}
              className="status-option"
              onClick={(event) => handleStatusOptionClick(event, status)}
            >
              {status}
            </div>
          ))}
        </div>
      )}
      {showDueTimeInput && (
        <div
          className="due-time-input"
          style={{
            top: dueTimeInputPosition.top,
            left: dueTimeInputPosition.left,
          }}
        >
          <input
            type="text"
            value={minutes}
            onChange={handleMinutesChange}
            placeholder="Enter minutes"
          />
          <button onClick={handleDueTimeSet}>배달 시간 설정</button>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default OrderNotification;
