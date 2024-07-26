import React, { useState } from "react";
import { updateMenu, updateOption } from "../config/storeApi";
import "./OptionInfoModal.css";
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
          value={optionTitle}
          onChange={(e) => {
            setOptionTitle(e.target.value);
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
        <textarea
          type="text"
          value={optionPrice}
          onChange={(e) => {
            setOptionPrice(e.target.value);
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
