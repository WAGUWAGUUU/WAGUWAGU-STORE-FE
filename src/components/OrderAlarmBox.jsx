import React from 'react';
import './OrderAlarmBox.css';

const OrderAlarmBox = ({ 
  orderNumber, 
  status, 
  customerId, 
  menu = [],  // Default to empty array
  dau, 
  options = [],  // Default to empty array
  customerAddress, 
  customerRequests, 
  estimatedTime, 
  onStatusClick, 
  backgroundColor 
}) => {
  return (
    <div className="aram-box" style={{ backgroundColor }}>
      <div className="header">Order <span className="number">{orderNumber}</span></div>
      <div className="content">
        <div className="status" onClick={(event) => onStatusClick(event, status, orderNumber)}>주문상태: {status}</div>
        <div>고객아이디: {customerId}</div>
        <div className="customerAddress">고객주소: {customerAddress}</div>
        <div className="customerRequests">가게요청: {customerRequests}</div>
        {dau && <div className="dau">픽업요청시간: {dau}</div>}
        {menu.map((menuItem, menuIndex) => (
          <div key={menuIndex}>
            <div className="menuName">{menuItem.menuName}</div>
            {menuItem.selectedOptions && menuItem.selectedOptions.map((option, optionIndex) => (
              <div key={optionIndex}>
                <div className="listName">{option.listName}</div>
                {option.options && option.options.map((opt, optIndex) => (
                  <div key={optIndex} className="optionTitle">
                    {opt.optionTitle} (+{opt.optionPrice}원)
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderAlarmBox;

