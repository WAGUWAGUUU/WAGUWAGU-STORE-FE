import { getAddressDetail } from "../api/Address";
import { saveStore } from "../api/Store";
import "./Store.css";

const Store = ({ store, setStore }) => {
  const saveStoreInfo = async () => {
    const storeName = document.getElementById("store-name").value;
    const storeAddress = document.getElementById("store-address").value;
    const storeCategory = document.getElementById("store-category").value;
    const storeOpenAt = document.getElementById("store-open-time").value;
    const storeCloseAt = document.getElementById("store-close-time").value;
    const storeIntroduction =
      document.getElementById("store-introduction").value;
    const minOrderAmount = document.getElementById(
      "minimum-order-amount"
    ).value;
    const storePhoneNumber =
      document.getElementById("store-phone-number").value;

    // input 값에 빈 칸이 있는지 검증
    if (
      storeName !== "" &&
      storeAddress !== "" &&
      storeCategory !== "default" &&
      storeOpenAt !== "" &&
      storeCloseAt !== "" &&
      storeIntroduction !== "" &&
      minOrderAmount !== "" &&
      storePhoneNumber !== ""
    ) {
      // 주소로 위, 경도 정보 가져오기 with kakao api
      const res = await getAddressDetail(storeAddress);
      const latitude = res.documents[0].y;
      const longitude = res.documents[0].x;

      // back에 저장
      const storeInfo = {
        storeName: storeName,
        storeAddressString: storeAddress,
        storeAddressX: longitude,
        storeAddressY: latitude,
        storeOpenAt: storeOpenAt,
        storeCloseAt: storeCloseAt,
        storePhone: storePhoneNumber,
        storeMinimumOrderAmount: minOrderAmount,
        storeIntroduction: storeIntroduction,
        storeCategory: storeCategory,
        ownerId: localStorage.getItem("ownerId"),
      };
      await saveStore(storeInfo);
      alert("저장이 완료되었습니다");
    } else {
      alert("빈 칸을 채워주세요");
    }
  };

  return (
    <>
      <div className="store-container">
        <h1 className="store-title">🏡 가게 정보</h1>
        <div className="store-input">
          <input id="image" type="file" />
        </div>
        <h3 className="store-item">가게명</h3>
        <div>
          <input
            id="store-name"
            className="store-input"
            placeholder="가게 이름을 입력해주세요"
            defaultValue={store && store.storeName}
          />
        </div>
        <h3 className="store-item">주소</h3>
        <div>
          <input
            id="store-address"
            className="store-input"
            placeholder="가게 주소를 입력해주세요"
            defaultValue={store && store.storeAddressString}
          />
        </div>
        <h3 className="store-item">가게 카테고리</h3>
        <div>
          <select
            id="store-category"
            className="store-input"
            defaultValue={store && store.storeCategory}
          >
            <option disabled selected hidden value="default">
              가게 카테고리 선택
            </option>
            <option value="피자">피자</option>
            <option value="중식">중식</option>
            <option value="치킨">치킨</option>
            <option value="디저트">디저트</option>
            <option value="양식">양식</option>
            <option value="한식">한식</option>
            <option value="일식">일식</option>
            <option value="회">회</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <h3 className="store-item">영업 시간</h3>
        <div>
          <input
            id="store-open-time"
            className="store-input"
            type="time"
            style={{ width: "20vh" }}
            defaultValue={store && store.storeOpenAt}
          />{" "}
          ~{" "}
          <input
            id="store-close-time"
            className="store-input"
            type="time"
            style={{ width: "20vh" }}
            defaultValue={store && store.storeCloseAt}
          />
        </div>
        <h3 className="store-item">가게 소개</h3>
        <div>
          <textarea
            id="store-introduction"
            className="store-input"
            placeholder="내 가게를 소개해주세요"
            rows={4}
            defaultValue={store && store.storeIntroduction}
          />
        </div>
        <h3 className="store-item">최소 주문 금액</h3>
        <div>
          <input
            id="minimum-order-amount"
            className="store-input"
            placeholder="최소 주문 금액을 입력해주세요"
            defaultValue={store && store.storeMinimumOrderAmount}
          />
        </div>
        <h3 className="store-item">가게 전화 번호</h3>
        <div>
          <input
            id="store-phone-number"
            className="store-input"
            placeholder="가게 전화 번호를 입력해주세요"
            defaultValue={store && store.storePhone}
          />
        </div>
        <div>
          <button className="store-save-button" onClick={saveStoreInfo}>
            저장
          </button>
        </div>
      </div>
    </>
  );
};

export default Store;
