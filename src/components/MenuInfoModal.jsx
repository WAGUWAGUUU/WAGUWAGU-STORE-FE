import React, { useState } from "react";
import { updateMenu } from "../config/storeApi";
import "./MenuInfoModal.css";
const MenuInfoModal = (props) => {
  const [menuName, setMenuName] = useState(props.menuName);
  const [menuIntroduction, setMenuIntroduction] = useState(
    props.menuIntroduction
  );
  const [menuPrice, setMenuPrice] = useState(props.menuPrice);
  const closeModal = () => {
    props.setOnMenuInfoModal(false);
  };

  const updateMenuNameApi = async () => {
    try {
      await updateMenu(props.menuId, "name", { value: menuName });
      alert("이름 변경 성공");
    } catch {
      console.log("error in updateMenuNameApi");
    }
  };
  const updateMenuIntroductionApi = async () => {
    try {
      await updateMenu(props.menuId, "introduction", {
        value: menuIntroduction,
      });
      alert("메뉴 정보 변경 성공");
    } catch {
      console.log("error in updateMenuIntroductionApi");
    }
  };
  const updateMenuPriceApi = async () => {
    try {
      await updateMenu(props.menuId, "price", { value: menuPrice });
      alert("메뉴 가격 변경 성공");
    } catch {
      console.log("error in updateMenuPriceApi");
    }
  };

  return (
    <div className="modal-container">
      <button
        className="modal-close"
        onClick={() => {
          closeModal();
        }}
      >
        X
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          margin: "20px",
          marginTop: "40px",
        }}
      >
        <textarea
          type="text"
          value={menuName}
          onChange={(e) => {
            setMenuName(e.target.value);
          }}
          rows="2"
          style={{
            border: "2px solid #94D35C",
            outlineColor: "#FBA138",
            borderRadius: "10px",
            padding: "5px",
            resize: "none",
            width: "400px",
            marginBottom: "5px",
          }}
        />
        <button
          style={{
            borderStyle: "solid",
            borderColor: "#94D35C",
            padding: "0px 7px",
            borderWidth: 3,
            height: "30px",
            width: "50px",
            fontSize: "15px",
          }}
          onClick={() => {
            updateMenuNameApi();
          }}
        >
          수정
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          margin: "20px",
        }}
      >
        <textarea
          type="text"
          value={menuIntroduction}
          onChange={(e) => {
            setMenuIntroduction(e.target.value);
          }}
          rows="5"
          style={{
            borderRadius: "10px",
            padding: "5px",
            resize: "none",
            width: "400px",
            border: "2px solid #94D35C",
            outlineColor: "#FBA138",
            marginBottom: "5px",
          }}
        />
        <button
          style={{
            borderStyle: "solid",
            borderColor: "#94D35C",
            padding: "0px 7px",
            borderWidth: 3,
            height: "30px",
            width: "50px",
            fontSize: "15px",
          }}
          onClick={() => {
            updateMenuIntroductionApi();
          }}
        >
          수정
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          margin: "20px",
        }}
      >
        <textarea
          type="text"
          value={menuPrice}
          onChange={(e) => {
            setMenuPrice(e.target.value);
          }}
          rows="2"
          style={{
            borderRadius: "10px",
            padding: "5px",
            resize: "none",
            width: "400px",
            border: "2px solid #94D35C",
            outlineColor: "#FBA138",
            marginBottom: "5px",
          }}
        />
        <button
          style={{
            borderStyle: "solid",
            borderColor: "#94D35C",
            padding: "0px 7px",
            borderWidth: 3,
            height: "30px",
            width: "50px",
            fontSize: "15px",
          }}
          onClick={() => {
            updateMenuPriceApi();
          }}
        >
          수정
        </button>
      </div>
    </div>
  );
};
export default MenuInfoModal;
