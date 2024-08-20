import React from "react";

const OptionDisplay = ({ options }) => (
  <div
    style={{
      backgroundColor: "#EECAD5", // 배경색
      borderRadius: "10px", // 모서리 둥글기
      padding: "20px", // 내부 여백
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 그림자
      margin: "10px 0", // 외부 여백
    }}
  >
    {options && options.length > 0 ? (
      options.map((option) => (
        <div key={option.optionId}>
          <span>{option.optionTitle}</span> -{" "}
          <span>{option.optionPrice}원</span>
        </div>
      ))
    ) : (
      <p>옵션이 없습니다</p>
    )}
  </div>
);

export default OptionDisplay;
