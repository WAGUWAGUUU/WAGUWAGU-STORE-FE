import { useEffect, useRef, useState } from "react";
import {
  getMenuCategoriesByStoreId,
  saveMenuCategory,
} from "../api/MenuCategory";
import "./Menu.css";
import { getMenuByMenuCategoryId, saveMenu } from "../api/Menu";
import {
  getMenuByMenuCategoryQL,
  getMenuCategoryByStoreQL,
  saveMenuCategoryQL,
  saveMenuQL,
} from "../config/storeGraphQL";
import axios from "axios";
import {
  getOptionListByMenuId,
  getOptionListsByStoreId,
  saveOptionList,
  saveOptionListAndOptions,
} from "../api/OptionList";
import { getOptions, saveOption } from "../api/Option";
import "./Menu.css";
import NewOptionInput from "./NewOptionInput";
import OptionDisplay from "./OptionListDisplay.jsx";
import menuImagePng from "./../assets/menu.png";

const Menu = ({ store, setStore }) => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [storeOptionList, setStoreOptionList] = useState([]);
  const [optionListsOfMenu, setOptionListsOfMenu] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [optionMenuId, setOptionMenuId] = useState(""); // 추가된 부분
  const [selectedOptionListId, setSelectedOptionListId] = useState("");
  const [selectedOptionListIdForOptions, setSelectedOptionListIdForOptions] =
      useState(""); // For 2nd part
  const [optionListName, setOptionListName] = useState("");
  const [optionListNameForOptions, setOptionListNameForOptions] = useState(""); // For 2nd part
  const [newOptions, setNewOptions] = useState([
    { optionTitle: "", optionPrice: "" },
  ]);
  const [newOptionsForOptions, setNewOptionsForOptions] = useState([
    { optionTitle: "", optionPrice: "" },
  ]); // For 2nd part
  const [showOptionListInput, setShowOptionListInput] = useState(false);
  const [showExistingOptions, setShowExistingOptions] = useState(false); // 추가된 부분
  const [options, setOptions] = useState([]);
  const [menuCategoriesAdded, setMenuCategoriesAdded] = useState(null);
  const [optionsOfMenu, setOptionsOfMenu] = useState([]); // For 2nd part
  const [menuAdded, setMenuAdded] = useState(null);
  const [optionListAdded, setOptionListAdded] = useState(null); // 추가된 부분

  const inputRef = useRef(null);
  const [menuImage, setMenuImage] = useState(menuImagePng);
  const [menuFile, setMenuFile] = useState("");
  const [menuImageUuid, setMenuImageUuid] = useState("");

  const createMenuCategroy = async () => {
    const menuCategory = document.getElementById("menu-category").value;
    if (menuCategory !== "") {
      const menuCategoryInfo = {
        menuCategoryName: menuCategory,
        storeId: store.storeId,
      };
      try {
        await saveMenuCategoryQL({ input: menuCategoryInfo });
        alert("저장이 완료되었습니다");
        setMenuCategoriesAdded({})
      } catch (e) {
        alert("해당 메뉴 카테고리는 이미 존재합니다");
      }
    } else alert("빈 칸을 채워주세요");
  };

  const getMenuCategories = async () => {
    // store 가 mystore.jsx에서 주입될 때까지 null로 가져옴
    console.log(store, "menuCategories");
    const res = await getMenuCategoryByStoreQL({ storeId: store.storeId });
    console.log(res, "getmenuCategories");
    setMenuCategories(res);
  };

  const saveMenuInfo = async () => {
    const menuCategoryId = document.getElementById(
        "menu-category-select"
    ).value;
    const menuName = document.getElementById("menu-name").value;
    const menuIntroduction = document.getElementById("menu-introduction").value;
    const menuPrice = document.getElementById("menu-price").value;

    let imageUrl = "";
    if (menuFile) {
      imageUrl = await uploadFile(menuFile);
    }
    console.log("Abc" + imageUrl);

    if (
        menuCategoryId !== "default" &&
        menuName !== "" &&
        menuIntroduction !== "" &&
        menuPrice !== ""
    ) {
      const saveInfo = {
        menuName: menuName,
        menuIntroduction: menuIntroduction,
        menuPrice: parseInt(menuPrice),
        menuCategoryId: menuCategoryId,
        menuImage: imageUrl,
      };
      try {
        console.log("savemenu 들어옴" + typeof menuPrice);
        await saveMenuQL({ input: saveInfo });
        alert("저장이 완료되었습니다");
        setMenuAdded({});
      } catch (e) {
        alert("해당 메뉴는 이미 존재합니다");
      }
    } else {
      handleError("빈 칸을 채워주세요");
    }
  };

  const getMenus = async () => {
    const arr = [];
    for (let category of menuCategories) {
      const res = await getMenuByMenuCategoryQL({
        menuCategoryId: category.menuCategoryId,
      });
      for (let menu of res) {
        arr.push(menu);
      }
    }
    setMenus(arr);
  };

  const getOptionListsByStore = async () => {
    try {
      const res = await getOptionListsByStoreId(store.storeId);
      const uniqueOptionLists = res.reduce((acc, item) => {
        if (!acc.find((optionList) => optionList.listId === item.listId)) {
          acc.push(item);
        }
        return acc;
      }, []);
      setStoreOptionList(uniqueOptionLists);
    } catch {
      handleError("옵션 카테고리 불러오기에 실패했습니다");
    } finally {
    }
  };

  const createOptionList = async () => {
    if (optionMenuId !== "default" && optionListName !== "") {
      const optionListRequest = {
        menuId: optionMenuId,
        listName: optionListName,
      };
      try {
        const res = await saveOptionList(optionListRequest);
        if (res.status === 201) {
          alert("옵션 카테고리가 추가되었습니다");
          setStoreOptionList((prev) => [...prev, optionListRequest]); // Update state with new option list
          setOptionListName(""); // Clear input field
        } else {
          alert("해당 옵션 카테고리는 이미 존재합니다");
        }
      } catch (e) {
        alert("해당 옵션 카테고리는 이미 존재합니다");
      } finally {
      }
    } else {
      alert("빈 칸을 채워주세요");
    }
  };

  const createOptionListAndOptions = async (
      menuId,
      optionListName,
      options = [],
      listId = null
  ) => {
    if (menuId !== "default" && optionListName !== "" && options.length > 0) {
      for (const option of options) {
        if (!option.optionTitle || !option.optionPrice) {
          alert("빈 칸을 모두 채워주세요.");
          return;
        }
      }

      // 기본 요청 객체 생성
      const optionListRequest = {
        menuId,
        listName: optionListName,
        options: options,
      };

      // listId가 null이 아닌 경우에만 추가
      if (listId !== null) {
        optionListRequest.listId = listId;
      }
      console.log(optionListRequest);
      try {
        const res = await saveOptionListAndOptions(optionListRequest);

        if (res.status === 201) {
          // Log the response data
          console.log("API Response:", res);

          // Handle the response based on the expected result
          alert("옵션 카테고리와 옵션이 추가되었습니다");
          setOptionListAdded({})
          setStoreOptionList((prev) => [...prev, optionListRequest]);
        } else if (res.status === 400) {
          console.error(res);
        }
      } catch (e) {
        console.error("Error during API call:", e.message);
        handleError("해당 옵션 카테고리 또는 옵션은 이미 존재합니다");
      } finally {
      }
    } else {
      handleError("빈 칸을 채워주세요 또는 옵션을 추가해주세요");
    }
  };

  const getOptionListsBySelectedMenu = async () => {
    if (selectedMenuId) {
      try {
        const res = await getOptionListByMenuId(selectedMenuId);
        setOptionListsOfMenu(res);
      } catch {
        handleError("옵션 카테고리 불러오기에 실패했습니다");
      } finally {
      }
    }
  };

  const getOptionByList = async () => {
    if (selectedOptionListId && selectedOptionListId !== "default") {
      try {
        const res = await getOptions(selectedOptionListId);
        if (res.status === 200) {
          console.log(res.data);
          setOptions(res.data);
        }
      } catch (error) {
        handleError("옵션 불러오기에 실패했습니다");
        console.error(error);
      }
    }
  };

  const getOptionsOfMenu = async () => {
    if (
        selectedOptionListIdForOptions &&
        selectedOptionListIdForOptions !== "default"
    ) {
      try {
        const res = await getOptions(selectedOptionListIdForOptions);
        if (res.status === 200) {
          console.log(res.data);
          setOptionsOfMenu(res.data);
        }
      } catch (error) {
        handleError("옵션 불러오기에 실패했습니다");
        console.error(error);
      }
    }
  };

  const createOption = async () => {
    if (
        selectedOptionListIdForOptions !== "default" &&
        newOptionsForOptions.length > 0
    ) {
      for (const option of newOptionsForOptions) {
        if (!option.optionTitle || !option.optionPrice) {
          alert("빈 칸을 모두 채워주세요.");
          return;
        }
      }

      const optionListRequest = {
        menuId: selectedMenuId,
        listId: selectedOptionListIdForOptions, // Ensure this is included in the request
        listName: optionListNameForOptions,
        options: newOptionsForOptions,
      };

      try {
        const response = await saveOptionListAndOptions(optionListRequest);

        // Log the response data
        console.log("API Response:", response);

        // Handle the response based on the expected result
        alert("옵션이 추가되었습니다");
        setOptionsOfMenu((prev) => [...prev, ...newOptionsForOptions]);
        setNewOptionsForOptions([{ optionTitle: "", optionPrice: "" }]); // Clear the input fields
      } catch (e) {
        console.error("Error during API call:", e.message);
        handleError("해당 옵션 또는 옵션 카테고리는 이미 존재합니다");
      } finally {
      }
    } else {
      handleError("빈 칸을 채워주세요 또는 옵션을 추가해주세요");
    }
  };

  const handleAddNewOption = () => {
    setNewOptions((prev) => [...prev, { optionTitle: "", optionPrice: "" }]);
  };

  const handleRemoveOption = (index) => {
    setNewOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewOptionChange = (index, field, value) => {
    const updatedOptions = newOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
    );
    setNewOptions(updatedOptions);
  };

  const handleAddNewOptionForOptions = () => {
    setNewOptionsForOptions((prev) => [
      ...prev,
      { optionTitle: "", optionPrice: "" },
    ]);
  };

  const handleRemoveOptionForOptions = (index) => {
    setNewOptionsForOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewOptionChangeForOptions = (index, field, value) => {
    const updatedOptions = newOptionsForOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
    );
    setNewOptionsForOptions(updatedOptions);
  };

  useEffect(() => {
    if (store) {
      getMenuCategories();
    }
  }, [menuCategoriesAdded, store]);

  useEffect(() => {
    if (menuCategories && menuCategories.length > 0) {
      getMenus();
      // getMenuCategories();
      getOptionListsByStore();
    }
  }, [menuAdded, menuCategories]);

  useEffect(() => {
    if (selectedMenuId) {
      getOptionListsBySelectedMenu();
    }
  }, [selectedMenuId]);

  useEffect(() => {
    if (selectedMenuId) getOptionListsBySelectedMenu();
    else console.log("getOptionListsBySelectedMenu : 메뉴 선택 시 진행 예정");
  }, [optionListAdded, selectedMenuId]);

  useEffect(() => {
    if (selectedOptionListId && selectedOptionListId !== "other") {
      getOptionByList();
    }
  }, [selectedOptionListId]);

  useEffect(() => {
    if (
        selectedOptionListIdForOptions &&
        selectedOptionListIdForOptions !== "other"
    ) {
      getOptionsOfMenu();
    }
  }, [selectedOptionListIdForOptions]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  const handleOptionListChange = (e) => {
    const value = e.target.value;
    setSelectedOptionListId(value);
    const selectedOptionList = storeOptionList.find(
        (option) => option.listId === parseInt(value)
    );
    if (selectedOptionList) {
      setOptionListName(selectedOptionList.listName);
    }
  };

  const handleOptionListChangeForOptions = (e) => {
    const value = e.target.value;
    setSelectedOptionListIdForOptions(value);
    if (value !== "default") {
      const selectedOptionList = optionListsOfMenu.find(
          (option) => option.optionListId === parseInt(value)
      );
      if (selectedOptionList) {
        setOptionListNameForOptions(selectedOptionList.listName);
      }
    }
  };

  const handleShowExistingOptions = () => {
    setShowExistingOptions(true);
    setShowOptionListInput(false);
  };

  const handleShowNewOptionListInput = () => {
    setShowOptionListInput(true);
    setShowExistingOptions(false);
  };

  const handleSave = () => {
    if (showOptionListInput) {
      createOptionListAndOptions(optionMenuId, optionListName, newOptions);
    } else if (showExistingOptions) {
      createOptionListAndOptions(
          optionMenuId,
          optionListName,
          options,
          selectedOptionListId
      ); // 기존 옵션리스트에 추가
    }
  };

  // 사진 업로드

  // 사진이랑 이미지 업로드 눌렀을 때 사진 넣을 수 있는 창 뜸
  const handleFileClick = () => {
    inputRef.current.click();
  };

  // 이미지 열기해서 사진을 넣었을 때 변화 체크
  // 이미지 업로드에서 미리보기 할 수 있게
  const handleFileChange = (e) => {
    setMenuFile(e.target.files[0]);
    setMenuImage(URL.createObjectURL(e.target.files[0]));
  };

  // 기본 이미지로 업로드 -> menu DB 에 저장될 때 image column 에 빈값이 들어오게
  const handleDefaultImage = () => {
    setMenuImage(menuImagePng);
    setMenuFile("");
    // setMenuImageUuid("");
  };

  // 새로운 파일 업로드
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
          `http://34.69.39.99/api/v1/photo/menu`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
      );

      // setMenuImage(
      //   "https://storage.googleapis.com/wgwg_bucket/" + response.data
      // );
      console.log("!!!!!upload!!!!" + response.data);
      return response.data;
    } catch (error) {
      console.error("Error upload file", error);
    }
  };

  return (
      <>
        <div className="store-container">
          <h1 className="store-title">🥑 메뉴 등록</h1>
          <h2 className="store-item">메뉴 카테고리 추가</h2>
          <div>
            <input
                id="menu-category"
                className="store-input"
                placeholder="메뉴 카테고리를 입력해주세요"
            />
          </div>
          <div>
            <button className="menu-save-button" onClick={createMenuCategroy}>
              저장
            </button>
          </div>

          <div>
            <hr />
            <h2 className="store-item">메뉴 추가</h2>
            <img
                src={menuImage}
                style={{
                  width: "150px",
                  height: "150px",
                  alignSelf: "center",
                  marginBottom: "20px",
                }}
                onClick={handleFileClick}
            ></img>
            <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={inputRef}
                style={{ display: "none" }}
            />
          </div>

          <div>
            <div className="menu-image-button-container">
              <div className="menu-image-button" onClick={handleFileClick}>
                이미지 업로드
              </div>
              <div className="menu-image-button" onClick={handleDefaultImage}>
                기본 이미지로 설정
              </div>
            </div>
            <h3 className="store-item">메뉴 카테고리</h3>
            <div>
              <select className="store-input" id="menu-category-select">
                <option disabled selected hidden value="default">
                  메뉴 카테고리 선택
                </option>
                {menuCategories &&
                    menuCategories.length > 0 &&
                    menuCategories.map((el, i) => {
                      return (
                          <option
                              key={el.menuCategoryId + el.menuCategoryName}
                              value={el.menuCategoryId}
                          >
                            {el.menuCategoryName}
                          </option>
                      );
                    })}
              </select>
            </div>
            <h3 className="store-item">메뉴 이름</h3>
            <div>
              <input
                  id="menu-name"
                  className="store-input"
                  placeholder="메뉴 이름을 입력해주세요"
              />
            </div>
            <h3 className="store-item">메뉴 소개</h3>
            <div>
            <textarea
                id="menu-introduction"
                className="store-input"
                placeholder="메뉴를 소개해주세요"
                rows={4}
            />
            </div>
            <h3 className="store-item">메뉴 금액</h3>
            <div>
              <input
                  id="menu-price"
                  className="store-input"
                  placeholder="메뉴 금액을 입력해주세요"
              />
            </div>
            <div>
              <button className="menu-save-button" onClick={saveMenuInfo}>
                저장
              </button>
            </div>
            <hr />
            <h2 className="store-item">옵션 카테고리 추가</h2>
            <div>
              <h3 className="store-item">메뉴 선택</h3>
              <select
                  className="store-input"
                  id="menu-select-option-list"
                  onChange={(e) => setOptionMenuId(e.target.value)}
              >
                <option disabled value="default">
                  메뉴 선택
                </option>
                {menus &&
                    menus.length > 0 &&
                    menus.map((el) => (
                        <option key={el.menuId} value={el.menuId}>
                          {el.menuName}
                        </option>
                    ))}
              </select>
            </div>
            <div>
              <button
                  className="menu-save-button"
                  onClick={handleShowExistingOptions}
              >
                기존 옵션카테고리 사용하기
              </button>
              <button
                  className="menu-save-button"
                  onClick={handleShowNewOptionListInput}
              >
                새로 추가하기
              </button>
            </div>
            {/* A */}
            {showExistingOptions && (
                <div>
                  <h3 className="store-item">사용 가능한 옵션 카테고리</h3>
                  <select
                      className="store-input"
                      id="store-option-list-select"
                      onChange={handleOptionListChange}
                  >
                    <option disabled value="default">
                      옵션 카테고리 선택
                    </option>
                    {storeOptionList &&
                        storeOptionList.length > 0 &&
                        storeOptionList.map((el) => (
                            <option key={el.listId} value={el.listId}>
                              {el.listName}
                            </option>
                        ))}
                  </select>
                  <h3 className="store-item">{optionListName}의 옵션</h3>
                  <OptionDisplay options={options} />
                </div>
            )}
            {/* B */}
            {showOptionListInput && (
                <div>
                  <h3>옵션리스트 추가하기</h3>
                  <input
                      id="option-list-name"
                      className="store-input"
                      placeholder="옵션 카테고리 이름"
                      value={optionListName}
                      onChange={(e) => setOptionListName(e.target.value)}
                  />
                  <NewOptionInput
                      newOptions={newOptions}
                      handleNewOptionChange={handleNewOptionChange}
                      handleAddNewOption={handleAddNewOption}
                      handleRemoveOption={handleRemoveOption}
                  />
                </div>
            )}
            <div>
              <button className="menu-save-button" onClick={handleSave}>
                저장
              </button>
            </div>
            <hr />

            {/* 2번 */}
            <h2 className="store-item">옵션 추가</h2>
            <div className="option-select-container">
              <div className="option-select-item">
                <select
                    className="store-input"
                    id="menu-select-option"
                    onChange={(e) => setSelectedMenuId(e.target.value)}
                    value={selectedMenuId}
                >
                  <option disabled value="default">
                    메뉴 선택
                  </option>
                  {menus &&
                      menus.length > 0 &&
                      menus.map((el) => (
                          <option key={el.menuId} value={el.menuId}>
                            {el.menuName}
                          </option>
                      ))}
                </select>
              </div>
              <div className="option-select-item">
                <select
                    id="option-list-select"
                    className="store-input"
                    onChange={handleOptionListChangeForOptions}
                    value={selectedOptionListIdForOptions}
                >
                  <option disabled value="default">
                    옵션 카테고리 선택
                  </option>
                  {optionListsOfMenu && optionListsOfMenu.length > 0 ? (
                      optionListsOfMenu.map((el) => (
                          <option key={el.optionListId} value={el.optionListId}>
                            {el.listName}
                          </option>
                      ))
                  ) : (
                      <option disabled value="default">
                        옵션 카테고리를 먼저 추가해주세요
                      </option>
                  )}
                </select>
              </div>
            </div>
            <div>
              <h3 className="store-item">{optionListNameForOptions}의 옵션</h3>
              <OptionDisplay options={optionsOfMenu} />
            </div>
            <NewOptionInput
                newOptions={newOptionsForOptions}
                handleNewOptionChange={handleNewOptionChangeForOptions}
                handleAddNewOption={handleAddNewOptionForOptions}
                handleRemoveOption={handleRemoveOptionForOptions}
            />
            <div>
              <button className="menu-save-button" onClick={createOption}>
                저장
              </button>
            </div>
          </div>
        </div>
      </>
  );
};

export default Menu;
