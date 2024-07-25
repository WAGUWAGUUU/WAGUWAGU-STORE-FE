import React from 'react';
import './StatusBox.css';

const StatusBox = ({ status, count }) => {
  return (
    <div className="status-box">
      <div className="status-header">{status}</div>
      <div className="status-count">{count}개</div>
    </div>
  );
};

export default StatusBox;
