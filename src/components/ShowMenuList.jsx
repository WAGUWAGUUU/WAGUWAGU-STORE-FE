import React, { useEffect, useState } from "react";
import "./ShowMenuList.css";
import {
  deleteMenuCategory,
  getMenuByMenuCategory,
  getMenuCategoryByStore,
} from "../config/storeApi";
import tteokbokki from "./../assets/tteokbokki.png";
import MenuCategoryInfoModal from "./MenuCategoryInfoModal";

const ShowMenuList = ({ store, setMenu, onMenuInfoModal }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [onMenuCategoryInfoModal, setOnMenuCategoryInfoModal] = useState("");

  const getMenuCategoryByStoreApi = async () => {
    try {
      const response = await getMenuCategoryByStore(store);
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
      const response = await getMenuByMenuCategory(menuCategoryId);
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
        await deleteMenuCategory(menuCategoryId);
        window.location.reload();
      }
    } catch {
      console.log("error in deleteMenuCategoryApi");
    }
  };

  useEffect(() => {
    getMenuCategoryByStoreApi();
  }, [store]);

  useEffect(() => {
    if (!onMenuInfoModal) {
      getMenuCategoryByStoreApi();
    }
  }, [onMenuInfoModal]);

  useEffect(() => {
    if (!onMenuCategoryInfoModal) {
      getMenuCategoryByStoreApi();
    }
  }, [onMenuCategoryInfoModal]);

  return (
    <div
      className="my-menu-container"
      style={{ width: window.innerWidth / 2.1 }}
    >
      {categories ? (
        categories.map((category) => {
          return (
            <div key={category.menuCategoryId}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ fontSize: 25, paddingBottom: 5 }}>
                  {category.menuCategoryName}
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
                      setOnMenuCategoryInfoModal((prev) => ({
                        ...prev,
                        [category.menuCategoryId]:
                          !prev[category.menuCategoryId],
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
                      deleteMenuCategoryApi(category.menuCategoryId);
                    }}
                  >
                    삭제
                  </button>
                  {onMenuCategoryInfoModal && (
                    <MenuCategoryInfoModal
                      setOnMenuCategoryInfoModal={setOnMenuCategoryInfoModal}
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
                        borderWidth: 5,
                        borderStyle: "dotted",
                        borderTopLeftRadius: "50px",
                        borderTopRightRadius: "50px",
                        borderEndEndRadius: "50px",
                        paddingLeft: "50px",
                        padding: "20px",
                        margin: "20px",
                        display: "flex",
                      }}
                      onClick={() => {
                        setSelectedId(menu.menuId);
                        //   navigator(`/my-menu/${menu.menuId}`);
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
                    // </TouchableOpacity>
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
    </div>
  );
};
export default ShowMenuList;
