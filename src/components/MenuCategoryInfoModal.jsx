import React, { useEffect, useState } from "react";
import {
  updateMenuCategoryName,
  updateOptionListName,
} from "../config/storeApi";
import "./MenuCategoryInfoModal.css";

const MenuCategoryInfoModal = (props) => {
  const menuCategoryId = props.menuCategoryId;
  const [menuCategoryName, setMenuCategoryName] = useState(
    props.menuCategoryName
  );

  const closeModal = () => {
    props.setOnMenuCategoryInfoModal(false);
  };

  const updateMenuCategoryNameApi = async (menuCategoryId) => {
    try {
      updateMenuCategoryName(menuCategoryId, { value: menuCategoryName });
      alert("메뉴 카테고리 변경 성공");
    } catch {
      console.log("error in updateMenuCategoryNameApi");
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
          margin: "40px",
        }}
      >
        <textarea
          type="text"
          value={menuCategoryName}
          onChange={(e) => {
            setMenuCategoryName(e.target.value);
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
            updateMenuCategoryNameApi(menuCategoryId);
          }}
        >
          수정
        </button>
      </div>
    </div>
  );
};
export default MenuCategoryInfoModal;
