import React, { useState } from 'react';
import './HistoryInquiry.css';
import StatusBox from '../components/StatusBox';

const HistoryInquiry = () => {
  const [histories, setHistories] = useState([
    { id: 1, customerId: 'cust01', menu: 'Menu1', options: 'Option1', request: 'No onions', address: '123 Main St', estimatedTime: '20 mins', status: '배달완료' },
    { id: 2, customerId: 'cust02', menu: 'Menu2', options: 'Option2', request: 'Extra sauce', address: '456 Oak St', estimatedTime: '15 mins', status: '배달완료' },
    { id: 3, customerId: 'cust03', menu: 'Menu3', options: 'Option3', request: 'Less spicy', address: '789 Pine St', estimatedTime: '30 mins', status: '주문취소' },
    { id: 4, customerId: 'cust04', menu: 'Menu4', options: 'Option4', request: 'No salt', address: '101 Maple St', estimatedTime: '25 mins', status: '주문취소' },
    { id: 5, customerId: 'cust05', menu: 'Menu5', options: 'Option5', request: 'No cheese', address: '202 Birch St', estimatedTime: '20 mins', status: '주문취소' },
    { id: 6, customerId: 'cust06', menu: 'Menu6', options: 'Option6', request: 'Extra spicy', address: '303 Cedar St', estimatedTime: '10 mins', status: '배달완료' },
    { id: 7, customerId: 'cust07', menu: 'Menu7', options: 'Option7', request: 'Gluten-free', address: '404 Spruce St', estimatedTime: '35 mins', status: '배달완료' },
    { id: 8, customerId: 'cust08', menu: 'Menu8', options: 'Option8', request: 'Less oil', address: '505 Walnut St', estimatedTime: '40 mins', status: '배달완료' },
  ]);

  const statusCounts = histories.reduce((counts, history) => {
    counts[history.status] = (counts[history.status] || 0) + 1;
    return counts;
  }, {});

  const [selectedFirstDate, setSelectedFirstDate] = useState(''); 
  const [selectedSecondDate, setSelectedSecondDate] = useState('');
  const [showDateInput, setShowDateInput] = useState(false);

  const handleFirstDateChange = (event) => { 
    setSelectedFirstDate(event.target.value);
  };

  const handleSecondDateChange = (event) => { 
    setSelectedSecondDate(event.target.value);
  };

  const toggleDateInput = () => {
    setShowDateInput((prevShowDateInput) => !prevShowDateInput);
  };

  const formatDate = (date) => {
    if (!date) return { year: '', month: '', day: '' };
    const [year, month, day] = date.split('-');
    return { year, month, day };
  };

  const firstDate = formatDate(selectedFirstDate);
  const secondDate = formatDate(selectedSecondDate);

  const handleInquiry = async () => {
    try {
      const response = await fetch(`/your-api-endpoint`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          startDate: selectedFirstDate,
          endDate: selectedSecondDate,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setHistories(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="history-inquiry">
      <div className="date-range">
        <div className="date-box">{firstDate.year}</div>
        <div className="date-box">{firstDate.month}</div>
        <div className="date-box">{firstDate.day}</div>
        <div className="date-separator">-</div>
        <div className="date-box">{secondDate.year}</div>
        <div className="date-box">{secondDate.month}</div>
        <div className="date-box">{secondDate.day}</div>
        <button className="inquiry-button" onClick={handleInquiry}>조회</button>
        <button className="inquiry-button" onClick={toggleDateInput}>날짜설정</button>
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
          count={`${statusCounts['배달완료'] || 0}`}
        />

        <StatusBox
          status="주문 취소건"
          count={`${statusCounts['주문취소'] || 0}`}
        />
        <StatusBox
          status="금액 통계"
          statusCounts={statusCounts['금액 통계'] || 0}개
        />
        <StatusBox
          status="배달 수수료"
          statusCounts={statusCounts['배달 수수료'] || 0}개
        />
        <StatusBox
          status="기타 등등"
          statusCounts={statusCounts['기타 등등'] || 0}개
        />
      </div>

      <div className="history-details">
        {histories.map((history) => (
          <div key={history.id} className="history-box">
            <div className="history-status">{history.status}</div>
            <div>주문아이디:{history.id}</div>
            <div>고객아이디:{history.customerId}</div>
            <div>메뉴:{history.menu}</div>
            <div>옵션:{history.options}</div>
            <div>고객요청:{history.request}</div>
            <div>고객주소:{history.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryInquiry;
