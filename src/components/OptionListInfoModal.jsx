import React, { useState } from "react";
import { updateOptionListName } from "../config/storeApi";
import "./MenuModal.css";

const OptionListInfoModal = (props) => {
  const optionListId = props.optionListId;
  const [optionListTitle, setOptionListTitle] = useState(props.optionListTitle);

  const closeModal = () => {
    props.setOnOptionListInfoModal(false);
  };

  const updateOptionListApi = async () => {
    try {
      await updateOptionListName(optionListId, {
        value: optionListTitle,
      });
      alert("옵션 리스트 변경 성공");
    } catch {
      console.log("error in updateOptionListApi");
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

      <div className="menu-modal-textAreas" style={{ margin: "40px" }}>
        <textarea
          type="text"
          value={optionListTitle}
          onChange={(e) => {
            setOptionListTitle(e.target.value);
          }}
          rows="2"
          className="menu-modal-textArea"
        />

        <button
          className="menu-modal-button"
          onClick={() => {
            updateOptionListApi();
          }}
        >
          수정
        </button>
      </div>
    </div>
  );
};
export default OptionListInfoModal;
