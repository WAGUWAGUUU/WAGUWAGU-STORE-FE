import React, { useState } from "react";
import { updateOptionListName } from "../config/storeApi";
import "./OptionListInfoModal.css";

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
          value={optionListTitle}
          onChange={(e) => {
            setOptionListTitle(e.target.value);
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
