import { useEffect, useRef, useState } from "react";
import { getAddressDetail } from "../api/Address";
import {
  blockStoreIsOpenedQL,
  checkBlockStoreIsOpenedQL,
  deleteStoreByIdQL,
  saveStoreQL,
  updateStoreByIdQL,
} from "../config/storeGraphQL";
import "./Store.css";
import axios from "axios";
import storeImagePng from "./../assets/food icon.png";

const Store = ({ store, setStore }) => {
  const [blockStoreIsOpened, setBlockStoreIsOpened] = useState(false);

  const inputRef = useRef(null);
  const [storeImage, setStoreImage] = useState(storeImagePng);
  const [storeFile, setStoreFile] = useState("");
  const [storeImageUuid, setStoreImageUuid] = useState("");

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

      let imageUrl = "";
      if (storeFile) {
        imageUrl = await uploadFile(storeFile);
      }
      console.log("Abc" + imageUrl);

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
        storeImage: imageUrl,
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

      let imageUrl = storeImageUuid;
      if (storeFile) {
        imageUrl = await uploadFile(storeFile);
      }
      console.log("Abc" + imageUrl);

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
        storeImage: imageUrl,
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

  const changeBlockStoreIsOpened = async () => {
    await blockStoreIsOpenedQL({ storeId: store.storeId });
    setBlockStoreIsOpened(!blockStoreIsOpened);
  };

  useEffect(() => {
    const checkBlockStoreIsOpened = async () => {
      if (store) {
        const result = await checkBlockStoreIsOpenedQL({
          storeId: store.storeId,
        });
        setBlockStoreIsOpened(result);
      }
    };
    if (store) {
      checkBlockStoreIsOpened();

      fetchUserProfileImage();
    }
  }, [store]);

  // 사진 업로드

  // 사진이랑 이미지 업로드 눌렀을 때 사진 넣을 수 있는 창 뜸
  const handleFileClick = () => {
    inputRef.current.click();
  };

  // 이미지 열기해서 사진을 넣었을 때 변화 체크
  // 이미지 업로드에서 미리보기 할 수 있게
  const handleFileChange = (e) => {
    setStoreFile(e.target.files[0]);
    setStoreImage(URL.createObjectURL(e.target.files[0]));
  };

  // 기본 이미지로 업로드 -> store DB 에 저장될 때 image column 에 값이 안 들어오게
  const handleDefaultImage = () => {
    setStoreImage(storeImagePng);
    setStoreFile("");
    setStoreImageUuid("");
  };

  // 새로운 파일 업로드
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `http://172.30.1.3:8081/api/v1/photo/store`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStoreImage(
        "https://storage.googleapis.com/wgwg_bucket/" + response.data
      );
      setStoreImageUuid(response.data);
      console.log(")))))12345)))))))" + response.data);
      return response.data;
    } catch (error) {
      console.error("Error upload file", error);
    }
  };

  // 맨 처음에 가지고 있는 이미지 가져오기
  // 빈 값으로 들어오면 미리 정해놓은 이미지로 보여주기
  const fetchUserProfileImage = async () => {
    try {
      const response = await axios.get(
        `http://34.69.39.99/api/v1/store/${store.storeId}/photo`
      );
      console.log(response.data);
      setStoreImageUuid(response.data);
      if (!response.data) {
        setStoreImage(storeImagePng);
      } else {
        setStoreImage(
          "https://storage.googleapis.com/wgwg_bucket/" + response.data
        );
      }
    } catch (error) {
      setStoreImage(storeImagePng);
    }
  };

  return (
    <>
      <div className="store-container">
        <h1 className="store-title">🏡 가게 정보</h1>
        <img
          src={storeImage}
          style={{
            width: "150px",
            height: "150px",
            alignSelf: "center",
            marginBottom: "20px",
          }}
          onClick={handleFileClick}
        ></img>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={inputRef}
          style={{ display: "none" }}
        />
        <div className="store-image-button-container">
          <div className="store-image-button" onClick={handleFileClick}>
            이미지 업로드
          </div>
          <div className="store-image-button" onClick={handleDefaultImage}>
            기본 이미지로 설정
          </div>
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

        <h3 className="store-item"> 영업 멈춤 수동 설정</h3>
        <p
          className="store-item"
          style={{ color: "#757575", marginLeft: "10px" }}
        >
          *영업 시간 중 영업 멈춤 설정이 가능합니다.*
        </p>
        <div>
          <button
            className="store-save-button"
            style={{
              backgroundColor: "white",
              borderColor: "#94D35C",
              borderWidth: "3px",
              marginTop: "0px",
            }}
            onClick={() => changeBlockStoreIsOpened()}
          >
            {blockStoreIsOpened ? "영업 중 막기 취소" : "영업 중 막기"}
          </button>
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
