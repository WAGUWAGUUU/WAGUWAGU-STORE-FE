import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import '../components/OrderAlarmBox.css';
import './OrderNotification.css';
import StatusBox from '../components/StatusBox';
import OrderAlarmBox from '../components/OrderAlarmBox';

const OrderNotification = () => {
  const [orders, setOrders] = useState([
    { id: 1, customerId: 'cust01', menu: 'Menu1', options: 'Option1', request: 'No onions', address: '123 Main St', estimatedTime: '20 mins', status: '배달 요청' },
    { id: 2, customerId: 'cust02', menu: 'Menu2', options: 'Option2', request: 'Extra sauce', address: '456 Oak St', estimatedTime: '15 mins', status: '배달 요청' },
    { id: 3, customerId: 'cust03', menu: 'Menu3', options: 'Option3', request: 'Less spicy', address: '789 Pine St', estimatedTime: '30 mins', status: '배달 요청' },
    { id: 4, customerId: 'cust04', menu: 'Menu4', options: 'Option4', request: 'No salt', address: '101 Maple St', estimatedTime: '25 mins', status: '배달 요청' },
    { id: 5, customerId: 'cust05', menu: 'Menu5', options: 'Option5', request: 'No cheese', address: '202 Birch St', estimatedTime: '20 mins', status: '배달 수락' },
    { id: 6, customerId: 'cust06', menu: 'Menu6', options: 'Option6', request: 'Extra spicy', address: '303 Cedar St', estimatedTime: '10 mins', status: '조리 중' },
    { id: 7, customerId: 'cust07', menu: 'Menu7', options: 'Option7', request: 'Gluten-free', address: '404 Spruce St', estimatedTime: '35 mins', status: '주문 요청건' },
    { id: 8, customerId: 'cust08', menu: 'Menu8', options: 'Option8', request: 'Less oil', address: '505 Walnut St', estimatedTime: '40 mins', status: '배달 요청' },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(currentDate.getDate()).padStart(2, '0'); // Pad single digits with leading zero

  useEffect(() => {
    // Fetch orders data from the API (commented out for dummy data)
    // const fetchOrders = async () => {
    //   try {
    //     const response = await fetch('API_ENDPOINT_HERE'); // Replace with your API endpoint
    //     const data = await response.json();
    //     setOrders(data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching orders:', error);
    //     setLoading(false);
    //   }
    // };

    // fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const statusOptions = ['주문 요청건', '조리 중', '배달 요청', '배달 수락', '배달 중'];

  const handleStatusChange = (orderId, newStatus) => {
    console.log(`Changing status of order ${orderId} to ${newStatus}`); // Debugging log
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
    setSelectedOrder(null); // Close the status selection
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
        return '#2B6DEF'; // Blue
      case '배달 수락':
        return '#F3DD0F'; // Yellow
      case '조리 중':
        return '#94D35C'; // Green
      case '주문 요청건':
        return '#E55959'; // Red
      case '배달 중':
        return '#6E5656'; // Dark brown
      default:
        return '#ffffff'; // Default color
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
        {orders.map((order) => (
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
        ))}
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
