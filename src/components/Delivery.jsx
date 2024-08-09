import { useEffect, useState } from "react";
import "./Delivery.css";
import {
  getDeliveryInfo,
  saveDeliveryInfo,
  updateDeliveryInfo,
} from "../api/Delivery";
import {
  getDeliveryInfoQL,
  saveDeliveryInfoQL,
  updateDeliveryInfoQL,
} from "../config/storeGraphQL";

const Delivery = ({ store, setStore }) => {
  const [secondInitRange, setSecondInitRange] = useState("미정");
  const [thirdInitRange, setThirdInitRange] = useState("미정");
  const [fourthInitRange, setFourthInitRange] = useState("미정");
  const [fifthInitRange, setFifthInitRange] = useState("미정");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [deliveryInfoAdded, setDeliveryInfoAdded] = useState(null);

  const setInitRange = (value, i) => {
    switch (i) {
      case 0:
        setSecondInitRange(value);
        break;
      case 1:
        setThirdInitRange(value);
        break;
      case 2:
        setFourthInitRange(value);
        break;
      case 3:
        setFifthInitRange(value);
        break;
      default:
        break;
    }
  };

  const getInitRange = (i) => {
    switch (i) {
      case 0:
        return 0;
      case 1:
        return secondInitRange;
      case 2:
        return thirdInitRange;
      case 3:
        return fourthInitRange;
      case 4:
        return fifthInitRange;
      default:
        return "미정";
    }
  };

  const saveDeliveryFee = async () => {
    const initRange = [
      0,
      secondInitRange,
      thirdInitRange,
      fourthInitRange,
      fifthInitRange,
    ];
    for (let i = 1; i <= 5; i++) {
      const deliveryEndRange = document.getElementById(
        `delivery-range${i}`
      ).value;
      const deliveryFee = document.getElementById(`delivery-fee${i}`).value;
      if (deliveryEndRange === "" || deliveryFee === "") {
        alert("빈 칸을 채워주세요");
        return;
      } else if (deliveryEndRange <= initRange[i - 1]) {
        alert("구간 입력값은 시작값보다 커야 합니다");
        return;
      }
    }

    if (store) {
      for (let i = 1; i <= 5; i++) {
        const rangeNumber = i;
        const deliveryEndRange = document.getElementById(
          `delivery-range${i}`
        ).value;
        const deliveryFee = document.getElementById(`delivery-fee${i}`).value;
        const deliveryFeeInfo = {
          storeDeliveryInfoState: parseInt(rangeNumber),
          storeDeliveryInfoFee: parseInt(deliveryFee),
          storeDeliveryInfoDistanceEnd: parseFloat(deliveryEndRange),
        };
        await saveDeliveryInfoQL({
          storeId: store.storeId,
          input: deliveryFeeInfo,
        });
      }
      alert("저장이 완료되었습니다");
      setDeliveryInfoAdded({});
    } else {
      console.log("저장 실패");
    }
  };

  const updateDeliveryFee = async () => {
    const initRange = [
      0,
      secondInitRange,
      thirdInitRange,
      fourthInitRange,
      fifthInitRange,
    ];
    for (let i = 1; i <= 5; i++) {
      const deliveryEndRange = document.getElementById(
        `delivery-range${i}`
      ).value;
      const deliveryFee = document.getElementById(`delivery-fee${i}`).value;
      if (deliveryEndRange === "" || deliveryFee === "") {
        alert("빈 칸을 채워주세요");
        return;
      } else if (deliveryEndRange <= initRange[i - 1]) {
        alert("구간 입력값은 시작값보다 커야 합니다");
        return;
      }
    }

    if (store) {
      for (let i = 1; i <= 5; i++) {
        const rangeNumber = i;
        const deliveryEndRange = document.getElementById(
          `delivery-range${i}`
        ).value;
        const deliveryFee = document.getElementById(`delivery-fee${i}`).value;
        const deliveryFeeInfo = {
          storeDeliveryInfoState: parseInt(rangeNumber),
          storeDeliveryInfoFee: parseInt(deliveryFee),
          storeDeliveryInfoDistanceEnd: parseFloat(deliveryEndRange),
        };
        await updateDeliveryInfoQL({
          storeId: store.storeId,
          input: deliveryFeeInfo,
        });
      }
      alert("수정이 완료되었습니다");
      setDeliveryInfoAdded({});
    } else {
      console.log("수정 실패");
    }
  };

  const getDeliveryInfoByStoreId = async () => {
    const res = await getDeliveryInfoQL({ storeId: store.storeId });
    setDeliveryInfo(res);
    if (res && res.length > 0) {
      setSecondInitRange(res[0]?.storeDeliveryInfoDistanceEnd ?? "미정");
      setThirdInitRange(res[1]?.storeDeliveryInfoDistanceEnd ?? "미정");
      setFourthInitRange(res[2]?.storeDeliveryInfoDistanceEnd ?? "미정");
      setFifthInitRange(res[3]?.storeDeliveryInfoDistanceEnd ?? "미정");
    }
  };

  useEffect(() => {
    if (store) {
      getDeliveryInfoByStoreId();
    }
  }, [store, deliveryInfoAdded]);

  return (
    <>
      <div className="store-container">
        <h1 className="store-title">🏍️ 배달 정보</h1>
        <h3 className="store-item">배달비</h3>
        {[1, 2, 3, 4, 5].map((el, i) => {
          return (
            <div key={i} className="delivery-fee-container">
              <div style={{ marginRight: "20px" }}>구간{el}</div>
              <div>
                {getInitRange(i)} ~{" "}
                <input
                  id={"delivery-range" + el}
                  className="delivery-range-input"
                  type="text"
                  onChange={(e) => setInitRange(e.target.value, i)}
                  defaultValue={
                    deliveryInfo &&
                    deliveryInfo.length > i &&
                    deliveryInfo[i]?.storeDeliveryInfoDistanceEnd
                      ? deliveryInfo[i].storeDeliveryInfoDistanceEnd
                      : ""
                  }
                />{" "}
                km
              </div>
              <div>
                <input
                  id={"delivery-fee" + el}
                  className="store-input"
                  type="text"
                  placeholder="배달비를 입력해주세요"
                  defaultValue={
                    deliveryInfo &&
                    deliveryInfo.length > i &&
                    deliveryInfo[i]?.storeDeliveryInfoFee
                      ? deliveryInfo[i].storeDeliveryInfoFee
                      : ""
                  }
                />
              </div>
            </div>
          );
        })}
        <div>
          <button
            className="store-save-button"
            onClick={
              deliveryInfo && deliveryInfo.length > 0
                ? updateDeliveryFee
                : saveDeliveryFee
            }
          >
            {deliveryInfo ? "수정" : "저장"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Delivery;
