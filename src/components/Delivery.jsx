import { useState } from 'react';
import './Delivery.css'
import { saveDeliveryInfo } from '../api/Delivery';

const Delivery = ({store, setStore}) => {
  const [secondInitRange, setSecondInitRange] = useState("미정");
  const [thirdInitRange, setThirdInitRange] = useState("미정");
  const [fourthInitRange, setFourthInitRange] = useState("미정");
  const [fifthInitRange, setFifthInitRange] = useState("미정");

  const setInitRange = (value, i) => {
    switch (i) {
      case 0 :
        setSecondInitRange(value);
        break;
      case 1 :
        setThirdInitRange(value);
        break;
      case 2 :
        setFourthInitRange(value);
        break;
      case 3 :
        setFifthInitRange(value);
    }
  };

  const getInitRange = (i) => {
    switch (i) {
      case 0 :
        return 0;
      case 1 :
        return secondInitRange;
      case 2 :
        return thirdInitRange;
      case 3 :
        return fourthInitRange;
      case 4 :
        return fifthInitRange;
    }
  };

  // store id를 가져와야 한다.
  const saveDeliveryFee = async () => {
    // 빈 칸이 있는지 검증
    for (let i = 1; i <= 5; i++) {
      const deliveryEndRange = document.getElementById(`delivery-range${i}`).value;
      const deliveryFee = document.getElementById(`delivery-fee${i}`).value;
      if (deliveryEndRange === "" || deliveryFee === "") {
        alert("빈 칸을 채워주세요");
        break;
      };
    };
    // 빈 칸이 다 채워졌다면 저장 진행
    for (let i = 1; i <= 5; i++) {
      const rangeNumber = i;
      const deliveryEndRange = document.getElementById(`delivery-range${i}`).value;
      const deliveryFee = document.getElementById(`delivery-fee${i}`).value;
      const deliveryFeeInfo = {
        storeDeliveryInfoState : rangeNumber
        , storeDeliveryInfoFee: deliveryFee
        , storeDeliveryInfoDistanceEnd: deliveryEndRange
      };
      await saveDeliveryInfo(store.storeId, deliveryFeeInfo);
    }
    alert("저장이 완료되었습니다");
  }
    


  return (
    <>
      <div className='store-container'>
        <h1 className='store-title'>🏍️ 배달 정보</h1>
        <h3 className='store-item'>배달비</h3>
        {[1,2,3,4,5].map((el, i) => {
        return (
          <div key={i} className='delivery-fee-container'>
            <div style={{marginRight: "20px"}}>구간{el}</div>   
            <div>{getInitRange(i)} ~ <input id={"delivery-range" + el} className='delivery-range-input' type="text" onChange={e => setInitRange(e.target.value, i)}/> km</div>
            <div>
              <input id={"delivery-fee" + el} className='store-input' type="text" placeholder='배달비를 입력해주세요' />
            </div>   
          </div>
        )})}
        <div>
          <button className='store-save-button' onClick={saveDeliveryFee}>저장</button>
        </div>
      </div>
    </>
  )
}

export default Delivery
