import { getAddressDetail } from "../api/Address";
import { deleteStoreById, saveStore, updateStoreById } from "../api/Store";
import {
  deleteStoreByIdQL,
  saveStoreQL,
  updateStoreByIdQL,
} from "../config/storeGraphQL";
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
        storeAddress: storeAddress,
        storeLongitude: longitude,
        storeLatitude: latitude,
        storeOpenAt: storeOpenAt,
        storeCloseAt: storeCloseAt,
        storePhone: storePhoneNumber,
        storeMinimumOrderAmount: minOrderAmount,
        storeIntroduction: storeIntroduction,
        storeCategory: storeCategory,
        ownerId: localStorage.getItem("ownerId"),
      };
      await saveStoreQL({ input: storeInfo });
      alert("저장이 완료되었습니다");
    } else {
      alert("빈 칸을 채워주세요");
    }
  };

  const deleteStoreInfo = async () => {
    if (store) {
      await deleteStoreByIdQL({ storeId: store.storeId });
      alert("삭제가 완료되었습니다");
    }
  };

  const updateStoreInfo = async () => {
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

    console.log(storeCategory, "업데이트");

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
      const updateInfo = {
        storeName: storeName,
        storeAddress: storeAddress,
        storeOpenAt: storeOpenAt,
        storeCloseAt: storeCloseAt,
        storePhone: storePhoneNumber,
        storeMinimumOrderAmount: parseInt(minOrderAmount),
        storeIntroduction: storeIntroduction,
        storeCategory: storeCategory,
        storeLongitude: parseFloat(longitude),
        storeLatitude: parseFloat(latitude),
      };

      await updateStoreByIdQL({
        storeId: store.storeId,
        input: updateInfo,
      });
      alert("수정이 완료되었습니다");
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
            defaultValue={store && store.storeAddress}
          />
        </div>
        <h3 className="store-item">가게 카테고리</h3>
        <div>
          <select id="store-category" className="store-input">
            <option disabled hidden selected={!store} value="default">
              가게 카테고리 선택
            </option>
            {[
              "피자",
              "중식",
              "치킨",
              "디저트",
              "양식",
              "한식",
              "일식",
              "회",
              "기타",
            ].map((el, i) => {
              return (
                <option
                  value={el}
                  key={i}
                  selected={store && store.storeCategory === el}
                >
                  {el}
                </option>
              );
            })}
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
        <div className="store-button-container">
          <div>
            <button
              className="store-save-button"
              onClick={store ? updateStoreInfo : saveStoreInfo}
            >
              {store ? "수정" : "저장"}
            </button>
          </div>
          {store && (
            <div>
              <button className="store-delete-button" onClick={deleteStoreInfo}>
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Store;
