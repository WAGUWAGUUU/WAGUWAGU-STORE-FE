import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import '../components/OrderAlarmBox.css';
import './OrderNotification.css';
import StatusBox from '../components/StatusBox';
import OrderAlarmBox from '../components/OrderAlarmBox';
import { updateState, selectByOwner } from '../config/orderApi';

const OrderNotification = ({ ownerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
  const day = String(currentDate.getDate()).padStart(2, '0');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await selectByOwner(ownerId);
        setOrders(data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [ownerId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const statusOptions = ['주문 요청건', '조리 중', '배달 요청', '배달 수락', '배달 중'];

  const handleStatusChange = async (orderId, newStatus) => {
    console.log(`Changing status of order ${orderId} to ${newStatus}`);

    try {
      await updateState(orderId, newStatus);
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
    }

    setSelectedOrder(null);
  };

  const handleOrderClick = (event, orderId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setSelectedOrder(orderId);
  };

  const statuses = orders.map(order => order.status);

  const statusCounts = {
    '주문 요청건': statuses.filter(status => status === '주문 요청건').length,
    '조리 중': statuses.filter(status => status === '조리 중').length,
    '배달 요청': statuses.filter(status => status === '배달 요청').length,
    '배달 수락': statuses.filter(status => status === '배달 수락').length,
    '배달 중': statuses.filter(status => status === '배달 중').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '배달 요청':
        return '#2B6DEF';
      case '배달 수락':
        return '#F3DD0F';
      case '조리 중':
        return '#94D35C';
      case '주문 요청건':
        return '#E55959';
      case '배달 중':
        return '#6E5656';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className="order-notification">
      <div className="date">
        <div className="date-box">{year}</div>
        <div className="date-box">{month}</div>
        <div className="date-box">{day}</div>
      </div>
      <div className="order-summary">
        <StatusBox status="주문 요청건" count={statusCounts['주문 요청건']} />
        <StatusBox status="조리 중" count={statusCounts['조리 중']} />
        <StatusBox status="배달 요청" count={statusCounts['배달 요청']} />
        <StatusBox status="배달 수락" count={statusCounts['배달 수락']} />
        <StatusBox status="배달 중" count={statusCounts['배달 중']} />
      </div>
      <div className="order-details">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderAlarmBox
              key={order.id}
              orderNumber={order.id}
              status={order.status}
              statusColor={getStatusColor(order.status)}
              customerId={order.customerId}
              menu={order.menu}
              options={order.options}
              request={order.request}
              address={order.address}
              estimatedTime={order.estimatedTime}
              onClick={(event) => handleOrderClick(event, order.id)}
              backgroundColor={getStatusColor(order.status)}
            />
          ))
        ) : (
          <div>No orders available</div>
        )}
      </div>
      {selectedOrder && (
        <div className="status-dropdown" style={{ position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left }}>
          {statusOptions.map(status => (
            <div
              key={status}
              className="status-option"
              onClick={() => handleStatusChange(selectedOrder, status)}
            >
              {status}
            </div>
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default OrderNotification;
