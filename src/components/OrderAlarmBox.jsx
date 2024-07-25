import React from 'react';
import './OrderAlarmBox.css';

const OrderAlarmBox = ({ orderNumber, status, customerId, menu, options, request, address, estimatedTime, onClick, backgroundColor ,pinColor}) => {
  return (
    <div className="aram-box" style={{ backgroundColor }}>
      <div className="number">{orderNumber}</div>
      <div className="pin-icon" style={{ color: pinColor }}>📌</div>
      <div className="status" onClick={onClick}>{status}</div>
      <div className="content">
        <p>Customer ID: {customerId}</p>
        <p>Menu: {menu}</p>
        <p>Options: {options}</p>
        <p>Request: {request}</p>
        <p>Address: {address}</p>
        <p>Estimated Time: {estimatedTime}</p>
      </div>
    </div>
  );
};

export default OrderAlarmBox;