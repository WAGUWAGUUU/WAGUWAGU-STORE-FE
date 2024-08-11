import React, { useEffect, useRef, useState } from "react";
import "./ShowMenuDetail.css";
import { useNavigate } from "react-router-dom";
import {
  deleteOption,
  deleteOptionList,
  getOptionListsByMenuId,
} from "../config/storeApi";
import MenuInfoModal from "./MenuInfoModal";
import OptionInfoModal from "./OptionInfoModal";
import OptionListInfoModal from "./OptionListInfoModal";
import {
  changeMenuPossibleQL,
  deleteMenuQL,
  getMenuByMenuIdQL,
  updateMenuQL,
} from "../config/storeGraphQL";
import menuImagePng from "./../assets/menu.png";
import axios from "axios";

const ShowMenuDetail = ({
  menu,
  onMenuInfoModal,
  setOnMenuInfoModal,
  menuDetailChange,
  setMenuDetailChange,
}) => {
  const [menuInfo, setMenuInfo] = useState({});
  const [optionLists, setOptionLists] = useState([]);
  const [onOptionInfoModal, setOnOptionInfoModal] = useState(false);
  const [onOptionListInfoModal, setOnOptionListInfoModal] = useState(false);
  const [onOptionDeleted, setOnOptionDeleted] = useState(false);
  const [onOptionListDeleted, setOnOptionListDeleted] = useState(false);
  const navigator = useNavigate();

  const inputRef = useRef(null);

  const getMenuByMenuIdApi = async () => {
    try {
      console.log("hihhihiih" + menu);
      const response = await getMenuByMenuIdQL({ menuId: menu });
      setMenuInfo(response);
      console.log("getMenu" + response);
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
      await changeMenuPossibleQL({ menuId: menu });
      window.location.reload();
    } catch {
      console.log("error in changeMenuPossibleApi");
    }
  };

  const deleteMenuApi = async () => {
    try {
      const result = confirm("진짜 삭제하시겠습니까?");
      if (result) {
        await deleteMenuQL({ menuId: menu });
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
  }, [menu, menuDetailChange]);

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

  // 사진 업로드

  // 사진이랑 이미지 업로드 눌렀을 때 사진 넣을 수 있는 창 뜸
  const handleFileClick = () => {
    inputRef.current.click();
  };

  // 이미지 열기해서 사진을 넣었을 때 변화 체크
  // 이미지 업로드에서 미리보기 할 수 있게
  const handleFileChange = async (e) => {
    // setMenuDetailFile(e.target.files[0]);
    // setMenuDetailImage(URL.createObjectURL(e.target.files[0]));
    let image = await uploadFile(e.target.files[0]);
    await updateMenuImageApi(image);
  };

  // 기본 이미지로 업로드 -> store DB 에 저장될 때 image column 에 빈 값이 들어오게
  const handleDefaultImage = async () => {
    // setMenuDetailImage(menuImagePng);
    // setMenuDetailFile("");
    // setMenuDetailImageUuid("");
    await updateMenuImageApi("");
  };

  // 새로운 파일 업로드
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `http://172.29.33.172:8081/api/v1/photo/store`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // setMenuDetailImage(
      //   "https://storage.googleapis.com/wgwg_bucket/" + response.data
      // );
      // setMenuDetailImageUuid(response.data);
      return response.data;
    } catch (error) {
      console.error("Error upload file", error);
    }
  };

  const updateMenuImageApi = async (menuDetailImageUuid) => {
    try {
      await updateMenuQL({
        menuId: menu,
        input: { type: "image", value: menuDetailImageUuid },
      });
      alert("이미지 변경 성공");
      setMenuDetailChange(true);
    } catch {
      console.log("error in updateMenuImageApi");
    }
  };

  return menu !== null ? (
    <div
      className="my-menu-detail-container"
      style={{ width: window.innerWidth / 2.1 }}
    >
      {menuInfo ? (
        <div>
          <div className="my-menu-detail-menuInfo-container">
            <div className="my-menu-detail-menuInfo-container2">
              {menuInfo.menuImage ? (
                <img
                  width={window.innerWidth / 3}
                  height="200px"
                  src={
                    "https://storage.googleapis.com/wgwg_bucket/" +
                    menuInfo.menuImage
                  }
                  onClick={handleFileClick}
                />
              ) : (
                <img
                  width={window.innerWidth / 3}
                  height="200px"
                  src={menuImagePng}
                  onClick={handleFileClick}
                />
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={inputRef}
                style={{ display: "none" }}
              />

              <div className="show-menu-detail-image-button-container">
                <div
                  className="show-menu-detail-image-button"
                  onClick={handleFileClick}
                >
                  이미지 업로드
                </div>
                <div
                  className="show-menu-detail-image-button"
                  onClick={handleDefaultImage}
                >
                  기본 이미지로 설정
                </div>
              </div>
            </div>
            <div className="my-menu-detail-menuInfo-container2">
              <div
                key={menuInfo.menuId}
                style={{
                  width: window.innerWidth / 3,
                }}
                className="my-menu-detail-menuInfo-box"
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
                    padding: "5px",
                    alignSelf: "center",
                  }}
                  className="my-menu-detail-modify-button"
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
                    padding: "5px",
                    alignSelf: "center",
                  }}
                  className="my-menu-detail-modify-button"
                  onClick={() => setOnMenuInfoModal(!onMenuInfoModal)}
                >
                  메뉴 수정
                </button>
                <button
                  style={{
                    padding: "5px",
                    alignSelf: "center",
                  }}
                  className="my-menu-detail-modify-button"
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
          <div className="my-menu-detail-menuInfo-container2">
            {optionLists ? (
              optionLists.map((optionList, index) => (
                <div
                  key={optionList.listId}
                  className="my-menu-detail-optionList-container"
                >
                  <div className="my-menu-detail-optionList-container2">
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
                        className="my-menu-detail-optionList-modify-button"
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
                          margin: "0px",
                        }}
                        className="my-menu-detail-optionList-modify-button"
                        onClick={() => {
                          deleteOptionListApi(optionList.listId);
                        }}
                      >
                        삭제
                      </button>
                      {onOptionListInfoModal[optionList.listId] && (
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
                      <div className="my-menu-detail-optionList-container2">
                        <div
                          key={option.optionId}
                          style={{
                            width: window.innerWidth / 4.1,
                            paddingLeft: "20px",
                            padding: "5px 20px",
                            margin: "10px 20px",
                            justifyContent: "space-between",
                          }}
                          className="my-menu-detail-menuInfo-box"
                        >
                          <p>{option.optionTitle}</p>
                          <p>{option.optionPrice}원</p>
                        </div>
                        <div style={{ display: "flex" }}>
                          <button
                            style={{
                              marginLeft: "20px",
                            }}
                            className="my-menu-detail-optionList-modify-button"
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
                              marginLeft: "0px",
                            }}
                            className="my-menu-detail-optionList-modify-button"
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
        className="my-menu-detail-plus-button"
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
