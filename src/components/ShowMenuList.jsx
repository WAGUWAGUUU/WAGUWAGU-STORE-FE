import React, { useEffect, useState } from "react";
import "./ShowMenuList.css";
import {
  getMenuByMenuCategory,
  getMenuCategoryByStore,
} from "../config/storeApi";
import tteokbokki from "./../assets/tteokbokki.png";

const ShowMenuList = ({ store, setMenu, onMenuInfoModal }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedId, setSelectedId] = useState("");
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

  useEffect(() => {
    getMenuCategoryByStoreApi();
  }, [store]);

  useEffect(() => {
    if (!onMenuInfoModal) {
      getMenuCategoryByStoreApi();
    }
  }, [onMenuInfoModal]);

  return (
    <div
      className="my-menu-container"
      style={{ width: window.innerWidth / 2.1 }}
    >
      {categories ? (
        categories.map((category) => {
          return (
            <div key={category.menuCategoryId}>
              <div>
                <p style={{ fontSize: 25, paddingBottom: 5 }}>
                  {category.menuCategoryName}
                </p>
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
                          <p style={{ marginTop: 10 }}>
                            가격 {menu.menuPrice}원
                          </p>
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
