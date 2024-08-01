import React, { useEffect, useState } from "react";
import "./ShowMenuList.css";
// import {
//   deleteMenuCategory,
//   getMenuByMenuCategory,
//   getMenuCategoryByStore,
// } from "../config/storeApi";
import tteokbokki from "./../assets/tteokbokki.png";
import MenuCategoryInfoModal from "./MenuCategoryInfoModal";
import { useNavigate } from "react-router-dom";
import {
  deleteMenuCategoryQL,
  getMenuByMenuCategoryQL,
  getMenuCategoryByStoreQL,
} from "../config/storeGraphQL";

const ShowMenuList = ({ store, setMenu, onMenuInfoModal }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [onMenuCategoryInfoModal, setOnMenuCategoryInfoModal] = useState("");
  const navigator = useNavigate();
  const [activeCategoryId, setActiveCategoryId] = useState("");
  // const [storeId, setStoreId] = useState("");

  const getMenuCategoryByStoreApi = async () => {
    try {
      const response = await getMenuCategoryByStoreQL({ storeId: store });
      console.log(response);
      setCategories(response);
      response.forEach((category) => {
        getMenuByMenuCategoryApi(category.menuCategoryId);
      });
    } catch {
      console.log("error in getMenuCategoryByStoreApi");
    }
  };

  const getMenuByMenuCategoryApi = async (menuCategoryId) => {
    try {
      const response = await getMenuByMenuCategoryQL({ menuCategoryId });
      setMenus((prevMenus) => ({ ...prevMenus, [menuCategoryId]: response }));
    } catch {
      console.log("error in getMenuByMenuCategoryApi");
    }
  };

  const deleteMenuCategoryApi = async (menuCategoryId) => {
    try {
      const result = confirm(
        "메뉴까지 같이 삭제됩니다. 진짜 삭제하시겠습니까?"
      );
      if (result) {
        await deleteMenuCategoryQL({ menuCategoryId });
        window.location.reload();
      }
    } catch {
      console.log("error in deleteMenuCategoryApi");
    }
  };

  useEffect(() => {
    if (store) {
      getMenuCategoryByStoreApi();
    }
  }, [store]);

  useEffect(() => {
    if (store && !onMenuInfoModal) {
      getMenuCategoryByStoreApi();
    }
  }, [onMenuInfoModal]);

  useEffect(() => {
    if (store && !onMenuCategoryInfoModal) {
      getMenuCategoryByStoreApi();
    }
  }, [onMenuCategoryInfoModal]);

  return (
    <div
      className="my-menu-list-container"
      style={{ width: window.innerWidth / 2.1 }}
    >
      {categories ? (
        categories.map((category) => {
          return (
            <div key={category.menuCategoryId}>
              <div className="my-menu-list-container2">
                <p style={{ fontSize: 25, paddingBottom: 5 }}>
                  {category.menuCategoryName}
                </p>
                <div>
                  <button
                    className="my-menu-list-modify-button"
                    onClick={() => setActiveCategoryId(category.menuCategoryId)}
                  >
                    수정
                  </button>
                  <button
                    style={{
                      margin: "0px",
                    }}
                    className="my-menu-list-modify-button"
                    onClick={() => {
                      deleteMenuCategoryApi(category.menuCategoryId);
                    }}
                  >
                    삭제
                  </button>

                  {activeCategoryId === category.menuCategoryId && (
                    <MenuCategoryInfoModal
                      setOnMenuCategoryInfoModal={setActiveCategoryId}
                      menuCategoryId={category.menuCategoryId}
                      menuCategoryName={category.menuCategoryName}
                    />
                  )}
                </div>
              </div>

              {menus[category.menuCategoryId] ? (
                menus[category.menuCategoryId].map((menu) => {
                  const color =
                    menu.menuId === selectedId ? "#FBA138" : "#94D35C";
                  return (
                    <div
                      key={menu.menuId}
                      style={{
                        borderColor: color,
                      }}
                      className="my-menu-list-menuInfo-box"
                      onClick={() => {
                        setSelectedId(menu.menuId);
                        setMenu(menu.menuId);
                      }}
                    >
                      <div style={{ width: "80%" }}>
                        {menu.menuPossible ? (
                          <p style={{ fontSize: 20 }}>{menu.menuName}</p>
                        ) : (
                          <p style={{ fontSize: 20, color: "red" }}>
                            [주문 막아놓음] {menu.menuName}
                          </p>
                        )}
                        <p
                          style={{
                            marginTop: 5,
                            color: "#757575",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {menu.menuIntroduction}
                        </p>
                        <p style={{ marginTop: 10 }}>가격 {menu.menuPrice}원</p>
                      </div>
                      <div>
                        <img
                          width="80px"
                          height="80px"
                          style={{ margin: "0px" }}
                          src={tteokbokki}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Loading...</p>
              )}
            </div>
          );
        })
      ) : (
        <div />
      )}
      <button
        className="my-menu-list-plus-button"
        onClick={() => {
          navigator(`/mystore`);
        }}
      >
        <p style={{ fontSize: "30px", color: "#FFFFFF" }}>+</p>
      </button>
    </div>
  );
};
export default ShowMenuList;
