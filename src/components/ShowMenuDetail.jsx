import React, { useEffect, useState } from "react";
import "./ShowMenuDetail.css";
import { useParams } from "react-router-dom";
import { getMenuByMenuId, getOptionListsByMenuId } from "../config/storeApi";
import tteokbokki from "./../assets/tteokbokki.png";
const ShowMenuDetail = () => {
  const { menuId } = useParams();
  const [menuInfo, setMenuInfo] = useState({});
  const [optionLists, setOptionLists] = useState([]);

  const getMenuByMenuIdApi = async () => {
    try {
      const response = await getMenuByMenuId(menuId);
      setMenuInfo(response);
    } catch {
      console.log("error in getMenuByMenuIdApi");
    }
  };

  const getOptionListsByMenuIdApi = async () => {
    try {
      const response = await getOptionListsByMenuId(menuId);
      setOptionLists(response);
      console.log("optionList " + response);
    } catch {
      console.log("error in getOptionListsByMenuIdApi");
    }
  };

  useEffect(() => {
    if (menuId) {
      getMenuByMenuIdApi();
      getOptionListsByMenuIdApi();
    }
    console.log(menuInfo);
  }, [menuId]);

  return (
    <div
      className="my-menu-detail-container"
      style={{ width: window.innerWidth / 2.1 }}
    >
      {menuInfo ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            width={window.innerWidth / 3}
            height="200px"
            style={{ margin: "20px" }}
            src={tteokbokki}
          />
          <div
            key={menuInfo.menuId}
            style={{
              width: window.innerWidth / 3,
              borderColor: "#94D35C",
              borderWidth: 5,
              borderStyle: "dotted",
              borderTopLeftRadius: "50px",
              borderTopRightRadius: "50px",
              borderEndEndRadius: "50px",
              paddingLeft: "50px",
              padding: "20px",
              margin: "5px",
              display: "flex",
            }}
          >
            <div>
              {menuInfo.menuPossible ? (
                <p style={{ fontSize: 20 }}>{menuInfo.menuName}</p>
              ) : (
                <p style={{ fontSize: 20, color: "red" }}>
                  [주문 막아놓음] {menuInfo.menuName}
                </p>
              )}
              <p
                style={{
                  marginTop: 5,
                  color: "#757575",
                }}
              >
                {menuInfo.menuIntroduction}
              </p>
              <p style={{ marginTop: 10 }}>가격 {menuInfo.menuPrice}원</p>
            </div>
          </div>
          {/* {optionLists ? (
            optionLists.map((optionList) => {
              <div key={optionList.listName}>
                <p>{optionList.listName}</p>
                {optionList.options ? (
                  optionList.options.map((option) => {
                    <div key={option.optionId}>
                      <p>{option.optionTitle}</p>
                      <p>{option.optionPrice}원</p>
                    </div>;
                  })
                ) : (
                  <p>텅!</p>
                )}
              </div>;
            })
          ) : (
            <div></div>
          )} */}
        </div>
      ) : (
        <p>텅!</p>
      )}
    </div>
  );
};
export default ShowMenuDetail;
