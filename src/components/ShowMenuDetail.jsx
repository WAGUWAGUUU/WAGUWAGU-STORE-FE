import React, { useEffect, useState } from "react";
import "./ShowMenuDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  changeMenuPossible,
  deleteMenu,
  deleteOption,
  deleteOptionList,
  getMenuByMenuId,
  getOptionListsByMenuId,
  updateOptionListName,
} from "../config/storeApi";
import tteokbokki from "./../assets/tteokbokki.png";
import StoreInfoModal from "./MenuInfoModal";
import MenuInfoModal from "./MenuInfoModal";
import { createPortal } from "react-dom";
import OptionInfoModal from "./OptionInfoModal";
import OptionListInfoModal from "./OptionListInfoModal";
const ShowMenuDetail = ({ menu, onMenuInfoModal, setOnMenuInfoModal }) => {
  const [menuInfo, setMenuInfo] = useState({});
  const [optionLists, setOptionLists] = useState([]);
  const [onOptionInfoModal, setOnOptionInfoModal] = useState(false);
  const [onOptionListInfoModal, setOnOptionListInfoModal] = useState(false);
  const [onOptionDeleted, setOnOptionDeleted] = useState(false);
  const [onOptionListDeleted, setOnOptionListDeleted] = useState(false);
  const navigator = useNavigate();

  const getMenuByMenuIdApi = async () => {
    try {
      const response = await getMenuByMenuId(menu);
      setMenuInfo(response);
    } catch {
      console.log("error in getMenuByMenuIdApi");
    }
  };

  const getOptionListsByMenuIdApi = async () => {
    try {
      const response = await getOptionListsByMenuId(menu);
      setOptionLists(response);
      console.log("optionList " + response);
    } catch {
      console.log("error in getOptionListsByMenuIdApi");
    }
  };

  const changeMenuPossibleApi = async () => {
    try {
      await changeMenuPossible(menu);
      window.location.reload();
    } catch {
      console.log("error in changeMenuPossibleApi");
    }
  };

  const deleteMenuApi = async () => {
    try {
      const result = confirm("진짜 삭제하시겠습니까?");
      if (result) {
        await deleteMenu(menu);
        window.location.reload();
      }
    } catch {
      console.log("error in deleteMenuApi");
    }
  };

  const deleteOptionApi = async (optionId) => {
    try {
      const result = confirm("진짜 삭제하시겠습니까?");
      if (result) {
        await deleteOption(optionId);
        setOnOptionDeleted(true);
      }
    } catch {
      console.log("error in deleteOptionApi");
    }
  };

  const deleteOptionListApi = async (optionId) => {
    try {
      const result = confirm("진짜 삭제하시겠습니까?");
      if (result) {
        await deleteOptionList(optionId);
        setOnOptionListDeleted(true);
      }
    } catch {
      console.log("error in deleteOptionListApi");
    }
  };

  useEffect(() => {
    if (menu) {
      getMenuByMenuIdApi();
      getOptionListsByMenuIdApi();
      setOnMenuInfoModal(false);
    }
    console.log(menuInfo);
  }, [menu]);

  useEffect(() => {
    if (menu && !onMenuInfoModal) {
      getMenuByMenuIdApi();
      getOptionListsByMenuIdApi();
    }
  }, [onMenuInfoModal]);

  useEffect(() => {
    if (menu && !onOptionInfoModal) {
      getMenuByMenuIdApi();
      getOptionListsByMenuIdApi();
    }
  }, [onOptionInfoModal]);

  useEffect(() => {
    if (menu && !onOptionListInfoModal) {
      getMenuByMenuIdApi();
      getOptionListsByMenuIdApi();
    }
  }, [onOptionListInfoModal]);

  useEffect(() => {
    if (menu && onOptionDeleted) {
      setOnOptionDeleted(false);
      getMenuByMenuIdApi();
      getOptionListsByMenuIdApi();
    }
  }, [onOptionDeleted]);

  useEffect(() => {
    if (menu && onOptionListDeleted) {
      setOnOptionListDeleted(false);
      getMenuByMenuIdApi();
      getOptionListsByMenuIdApi();
    }
  }, [onOptionListDeleted]);

  return menu !== null ? (
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
              <div style={{ alignSelf: "flex-end" }}>
                <button
                  style={{
                    borderStyle: "solid",
                    borderColor: "#94D35C",
                    padding: "5px",
                    borderWidth: 3,
                    marginTop: "10px",
                    alignSelf: "center",
                  }}
                  onClick={() => {
                    changeMenuPossibleApi();
                  }}
                >
                  {menuInfo.menuPossible ? (
                    <p>메뉴 막기</p>
                  ) : (
                    <p>메뉴 막기 취소</p>
                  )}
                </button>
                <button
                  style={{
                    borderStyle: "solid",
                    borderColor: "#94D35C",
                    padding: "5px",
                    borderWidth: 3,
                    marginTop: "10px",
                    alignSelf: "center",
                  }}
                  onClick={() => setOnMenuInfoModal(!onMenuInfoModal)}
                >
                  메뉴 수정
                </button>
                <button
                  style={{
                    borderStyle: "solid",
                    borderColor: "#94D35C",
                    padding: "5px",
                    borderWidth: 3,
                    marginTop: "10px",
                    alignSelf: "center",
                  }}
                  onClick={() => {
                    deleteMenuApi();
                  }}
                >
                  메뉴 삭제
                </button>
                {onMenuInfoModal && (
                  <MenuInfoModal
                    setOnMenuInfoModal={setOnMenuInfoModal}
                    menuId={menuInfo.menuId}
                    menuName={menuInfo.menuName}
                    menuIntroduction={menuInfo.menuIntroduction}
                    menuPrice={menuInfo.menuPrice}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", margin: "20px" }}
          >
            {optionLists ? (
              optionLists.map((optionList, index) => (
                <div
                  key={optionList.listId}
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p
                      style={{
                        fontSize: 18,
                        color: "#757575",
                      }}
                    >
                      {optionList.listName}
                    </p>
                    <div>
                      <button
                        style={{
                          borderStyle: "solid",
                          borderColor: "#94D35C",
                          padding: "0px 7px",
                          marginLeft: "20px",
                          borderWidth: 3,
                          height: "30px",
                          width: "50px",
                          fontSize: "15px",
                        }}
                        onClick={() =>
                          setOnOptionListInfoModal((prev) => ({
                            ...prev,
                            [optionList.listId]: !prev[optionList.listId],
                          }))
                        }
                      >
                        수정
                      </button>
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
                          deleteOptionListApi(optionList.listId);
                        }}
                      >
                        삭제
                      </button>
                      {onOptionListInfoModal && (
                        <OptionListInfoModal
                          setOnOptionListInfoModal={setOnOptionListInfoModal}
                          optionListId={optionList.listId}
                          optionListTitle={optionList.listName}
                        />
                      )}
                    </div>
                  </div>

                  {optionList.options.length > 0 ? (
                    optionList.options.map((option) => (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          key={option.optionId}
                          // style={{ padding: "20px 40px", display: "flex" }}
                          style={{
                            width: window.innerWidth / 4.1,
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
                        <div>
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
                            onClick={() =>
                              setOnOptionInfoModal((prev) => ({
                                ...prev,
                                [option.optionId]: !prev[option.optionId],
                              }))
                            }
                          >
                            수정
                          </button>
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
                              deleteOptionApi(option.optionId);
                            }}
                          >
                            삭제
                          </button>
                        </div>

                        {onOptionInfoModal[option.optionId] && (
                          <OptionInfoModal
                            setOnOptionInfoModal={setOnOptionInfoModal}
                            optionId={option.optionId}
                            optionTitle={option.optionTitle}
                            optionPrice={option.optionPrice}
                          />
                        )}
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
      <button
        style={{
          borderColor: "#FFFFFF",
          backgroundColor: "#FBA138",
          borderWidth: 3,
          width: "50px",
          height: "50px",
          borderRadius: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
        onClick={() => {
          navigator(`/mystore`);
        }}
      >
        <p style={{ fontSize: "30px", color: "#FFFFFF" }}>+</p>
      </button>
    </div>
  ) : (
    <div></div>
  );
};
export default ShowMenuDetail;
