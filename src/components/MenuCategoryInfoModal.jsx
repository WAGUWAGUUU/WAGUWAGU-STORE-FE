import React, { useState } from "react";
import "./MenuModal.css";
import { updateMenuCategoryNameQL } from "../config/storeGraphQL";

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
      updateMenuCategoryNameQL({
        menuCategoryId: menuCategoryId,
        input: { value: menuCategoryName },
      });
      alert("메뉴 카테고리 변경 성공");
      // window.location.reload();
    } catch {
      console.log("error in updateMenuCategoryNameApi");
    }
  };

  return (
    <div className="menu-category-modal-container">
      <button
        className="menu-modal-close"
        onClick={() => {
          closeModal();
        }}
      >
        X
      </button>

      <div className="menu-modal-textAreas" style={{ margin: "40px" }}>
        <textarea
          type="text"
          value={menuCategoryName}
          onChange={(e) => {
            setMenuCategoryName(e.target.value);
          }}
          rows="2"
          className="menu-modal-textArea"
        />

        <button
          className="menu-modal-button"
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
