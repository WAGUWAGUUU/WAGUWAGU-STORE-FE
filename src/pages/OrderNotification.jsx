import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import moment from 'moment-timezone';
import '../components/OrderAlarmBox.css';
import './OrderNotification.css';
import StatusBox from '../components/StatusBox';
import OrderAlarmBox from '../components/OrderAlarmBox';
import { updateState, selectByOwner } from '../config/orderApi';

const OrderNotification = () => {
  const [ownerId, setOwnerId] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [minutes, setMinutes] = useState('');
  const [showDueTimeInput, setShowDueTimeInput] = useState(false);
  const [dueTimeInputPosition, setDueTimeInputPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const fetchOrders = async (ownerId) => {
    if (!ownerId) {
      console.log('Owner ID is not set.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`요청하는 가게 ${ownerId}`);
      const response = await selectByOwner(ownerId);
      console.log('Fetched data:', response);
      if (Array.isArray(response)) {
        const processedOrders = response.map(order => ({
          ...order,
          status: order.orderState[order.orderState.length - 1]
        }));
        setOrders(processedOrders);
      } else {
        console.error('Response is not an array:', response);
        setOrders([]);
      }
    } catch (error) {
      console.error('OrderNotification 에러', error);
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerIdChange = (e) => {
    setOwnerId(e.target.value);
  };

  const handleFetchOrders = () => {
    fetchOrders(ownerId);
  };

  const handleStatusChange = async (orderId, newStatus, customDueTime = null) => {
    let dueTime = customDueTime;

    if (!dueTime && newStatus === '배달 요청') {
      const now = moment().tz('Asia/Seoul');
      dueTime = now.clone().add(parseInt(minutes, 10), 'minutes').tz('Asia/Seoul').valueOf();
    }

    const updateRequest = {
      status: newStatus,
      riderId: null,
      due: dueTime,
    };

    console.log('Update request payload:', updateRequest);

    try {
      const response = await updateState(orderId, updateRequest);
      console.log('Update response:', response);
      setOrders(orders.map(order => {
        if (order.id === orderId || order.orderId === orderId) {
          return { ...order, status: newStatus, due: dueTime };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating order status:', error.response ? error.response.data : error.message);
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
    console.log('Selected order has been updated:', selectedOrder);
  }, [selectedOrder]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const statusOptions = ['주문 요청', '조리중', '배달 요청', '배달 수락', '배달중', '배달 완료'];

  const statuses = orders.map(order => order.status);

  const statusCounts = {
    '주문 요청': statuses.filter(status => status === '주문 요청').length,
    '조리중': statuses.filter(status => status === '조리중').length,
    '배달 요청': statuses.filter(status => status === '배달 요청').length,
    '배달 수락': statuses.filter(status => status === '배달 수락').length,
    '배달중': statuses.filter(status => status === '배달중').length,
    '배달 완료': statuses.filter(status => status === '배달 완료').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '배달 요청':
        return '#2B6DEF';
      case '배달 수락':
        return '#F3DD0F';
      case '조리중':
        return '#94D35C';
      case '주문 요청':
        return '#E55959';
      case '배달중':
        return '#6E5656';
      case '배달 완료':
        return '#808080';
      default:
        return '#ffffff';
    }
  };

  const handleStatusOptionClick = (event, status) => {
    if (status === '배달 요청') {
      setDueTimeInputPosition({ top: event.clientY + window.scrollY, left: event.clientX + window.scrollX });
      setMinutes('');
      setShowDueTimeInput(true);
    }
    else if(status === '조리중'){
      handleStatusChange(selectedOrder, status);
      notifyAndPlayAudio('order-received');
    }
    else if(status === '배달 수락'){
      handleStatusChange(selectedOrder, status);
      notifyAndPlayAudio('dispatch-completed');
    }
    else if(status === '배달 완료'){
      handleStatusChange(selectedOrder, status);
      notifyAndPlayAudio('delivery-completed');
    }
    else {
      setShowDueTimeInput(false);
      handleStatusChange(selectedOrder, status);
    }
  };

  const handleDueTimeSet = () => {
    const dueTime = moment().tz('Asia/Seoul').add(parseInt(minutes, 10), 'minutes').valueOf();
    handleStatusChange(selectedOrder, '배달 요청', dueTime);
  };

  const handleMinutesChange = (e) => {
    let value = e.target.value;

    if (value.length > 3) {
      value = value.slice(0, 3);
    }

    setMinutes(value);
  };


  const notifyAndPlayAudio = async (orderStatus) => {
    try {
      const response = await fetch(`http://192.168.0.15:8000/notify/order-status?order_status=${orderStatus}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const arrayBuffer = await blobToArrayBuffer(blob);
        const base64String = arrayBufferToBase64(arrayBuffer);

        // Create a blob URL for the audio file
        const audioUrl = `data:audio/mp3;base64,${base64String}`;
        const audio = new Audio(audioUrl);
        audio.play();

        // Optional: Add an event listener to clean up after the audio is played
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);  // Release the object URL
          console.log('Audio playback finished');
        };
      } else {
        console.error("Failed to notify:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch and play audio:", error);
    }
  };

  // Helper function to convert Blob to ArrayBuffer
  const blobToArrayBuffer = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read blob as array buffer.'));
      reader.readAsArrayBuffer(blob);
    });
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);  // Convert binary string to base64
  };

  return (
    <div className="order-notification">
      <div className="input-box">
        <input
          type="number"
          value={ownerId}
          onChange={handleOwnerIdChange}
          placeholder="Enter owner ID"
        />
        <button onClick={handleFetchOrders}>조회하기</button>
      </div>
      <div className="date">
        <div className="date-box">{year}</div>
        <div className="date-box">{month}</div>
        <div className="date-box">{day}</div>
      </div>
      <div className="order-summary">
        <StatusBox status="주문 요청" count={statusCounts['주문 요청']} />
        <StatusBox status="조리중" count={statusCounts['조리중']} />
        <StatusBox status="배달 요청" count={statusCounts['배달 요청']} />
        <StatusBox status="배달 수락" count={statusCounts['배달 수락']} />
        <StatusBox status="배달중" count={statusCounts['배달중']} />
        <StatusBox status="배달 완료" count={statusCounts['배달 완료']} />
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
          {statusOptions.map(status => (
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
        <div className="due-time-input" style={{ top: dueTimeInputPosition.top, left: dueTimeInputPosition.left }}>
          <input
            type="text"
            value={minutes}
            onChange={handleMinutesChange}
            placeholder="Enter minutes"
          />
          <button onClick={handleDueTimeSet}>
            배달 시간 설정
          </button>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default OrderNotification;
