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
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "20px",
              }}
            >
              <img
                width={window.innerWidth / 3}
                height="200px"
                //   style={{ margin: "20px" }}
                src={tteokbokki}
              />
              <button
                style={{
                  borderStyle: "solid",
                  borderColor: "#94D35C",
                  padding: "0px 7px",
                  borderWidth: 3,
                  marginTop: "10px",
                  alignSelf: "flex-end",
                }}
              >
                사진 수정
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "20px",
              }}
            >
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
              <button
                style={{
                  borderStyle: "solid",
                  borderColor: "#94D35C",
                  padding: "0px 7px",
                  borderWidth: 3,
                  marginTop: "10px",
                  alignSelf: "flex-end",
                }}
              >
                메뉴 수정
              </button>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", margin: "20px" }}
          >
            {optionLists ? (
              optionLists.map((optionList, index) => (
                <div
                  key={index}
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <p
                    style={{
                      fontSize: 18,
                      color: "#757575",
                    }}
                  >
                    {optionList.listName}
                  </p>

                  {optionList.options.length > 0 ? (
                    optionList.options.map((option) => (
                      <div
                        key={option.optionId}
                        // style={{ padding: "20px 40px", display: "flex" }}
                        style={{
                          width: window.innerWidth / 3,
                          borderColor: "#94D35C",
                          borderWidth: 5,
                          borderStyle: "dotted",
                          borderTopLeftRadius: "50px",
                          borderTopRightRadius: "50px",
                          borderEndEndRadius: "50px",
                          paddingLeft: "20px",
                          padding: "5px 20px",
                          margin: "10px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p>{option.optionTitle}</p>
                        <p>{option.optionPrice}원</p>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "20px 40px", display: "flex" }}>
                      옵션이 없습니다
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ fontSize: 18, color: "#757575" }}>
                옵션 리스트가 없습니다.
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>메뉴 정보가 없습니다</p>
      )}
    </div>
  );
};
export default ShowMenuDetail;
