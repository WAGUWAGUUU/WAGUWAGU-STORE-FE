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
  const [minutes, setMinutes] = useState(0);
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

  const handleStatusChange = async (orderId, newStatus) => {
    const now = moment().tz('Asia/Seoul');
    let dueTime = null;
  
    if (newStatus === '배달 요청') {
      dueTime = now.clone().add(minutes, 'minutes').tz('Asia/Seoul').format('YYYY-MM-DDTHH:mm:ss.SSS'); // LocalDateTime format without offset
    }
  
    const updateRequest = {
      status: newStatus,
      riderId: null,  // Ensure riderId is included, even if null
      due: dueTime,
    };
  
    console.log('Update request payload:', updateRequest);
  
    try {
      const response = await updateState(orderId, updateRequest);
      console.log('Update response:', response);
      setOrders(orders.map(order => {
        if (order.id === orderId || order.orderId === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating order status:', error.response ? error.response.data : error.message);
    }
  
    setSelectedOrder(null);
    setShowDueTimeInput(false);
  };

  const handleOrderClick = (event, orderId, currentStatus) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setSelectedOrder(orderId);
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
      setShowDueTimeInput(true);
    } else {
      setShowDueTimeInput(false);
      handleStatusChange(selectedOrder, status);
    }
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
              menu={order.menu}
              options={order.options}
              request={order.request}
              address={order.address}
              estimatedTime={order.estimatedTime}
              onClick={(event) => handleOrderClick(event, order.orderId, order.status)}
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
            type="number"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            placeholder="Enter minutes"
          />
          <button onClick={() => handleStatusChange(selectedOrder, '배달 요청')}>
            배달 시간 설정
          </button>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default OrderNotification;
