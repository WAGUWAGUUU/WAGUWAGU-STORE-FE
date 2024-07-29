import React, { useState } from "react";
import { updateMenu } from "../config/storeApi";
import "./MenuModal.css";
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
    <div className="menu-modal-container">
      <button
        className="menu-modal-close"
        onClick={() => {
          closeModal();
        }}
      >
        X
      </button>

      <div className="menu-modal-textAreas">
        <textarea
          type="text"
          value={menuName}
          onChange={(e) => {
            setMenuName(e.target.value);
          }}
          rows="2"
          className="menu-modal-textArea"
        />
        <button
          className="menu-modal-button"
          onClick={() => {
            updateMenuNameApi();
          }}
        >
          수정
        </button>
      </div>
      <div className="menu-modal-textAreas" style={{ marginTop: "20px" }}>
        <textarea
          type="text"
          value={menuIntroduction}
          onChange={(e) => {
            setMenuIntroduction(e.target.value);
          }}
          rows="5"
          className="menu-modal-textArea"
        />
        <button
          className="menu-modal-button"
          onClick={() => {
            updateMenuIntroductionApi();
          }}
        >
          수정
        </button>
      </div>
      <div className="menu-modal-textAreas" style={{ marginTop: "20px" }}>
        <textarea
          type="text"
          value={menuPrice}
          onChange={(e) => {
            setMenuPrice(e.target.value);
          }}
          rows="2"
          className="menu-modal-textArea"
        />
        <button
          className="menu-modal-button"
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
