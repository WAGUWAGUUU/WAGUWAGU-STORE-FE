import React, { useState } from "react";
import { updateOption } from "../config/storeApi";
import "./MenuModal.css";
const OptionInfoModal = (props) => {
  const optionId = props.optionId;
  const [optionTitle, setOptionTitle] = useState(props.optionTitle);
  const [optionPrice, setOptionPrice] = useState(props.optionPrice);

  const closeModal = () => {
    props.setOnOptionInfoModal(false);
  };

  const updateOptionApi = async () => {
    try {
      await updateOption(optionId, {
        optionTitle: optionTitle,
        optionPrice: optionPrice,
      });
      alert("옵션 변경 성공");
    } catch {
      console.log("error in updateOptionApi");
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
          value={optionTitle}
          onChange={(e) => {
            setOptionTitle(e.target.value);
          }}
          rows="2"
          className="menu-modal-textArea"
        />
        <textarea
          type="text"
          value={optionPrice}
          onChange={(e) => {
            setOptionPrice(e.target.value);
          }}
          rows="2"
          className="menu-modal-textArea"
        />
        <button
          className="menu-modal-button"
          onClick={() => {
            updateOptionApi();
          }}
        >
          수정
        </button>
      </div>
    </div>
  );
};
export default OptionInfoModal;
