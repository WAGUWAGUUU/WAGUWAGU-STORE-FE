import { useEffect, useState } from 'react';
import { getMenuCategoriesByStoreId, saveMenuCategory } from '../api/MenuCategory';
import { getMenuByMenuCategoryId, saveMenu } from '../api/Menu';
import {
  getOptionListByMenuId,
  getOptionListsByStoreId,
  saveOptionList,
  saveOptionListAndOptions
} from '../api/OptionList';
import { getOptions, saveOption } from '../api/Option';
import './Menu.css';
import OptionListDisplay from "./OptionListDisplay.jsx";
import NewOptionInput from "./NewOptionInput.jsx";

const Menu = ({ store }) => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [storeOptionList, setStoreOptionList] = useState([]);
  const [optionLists, setOptionLists] = useState([]);
  const [optionListsOfMenu, setOptionListsOfMenu] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [selectedOptionListId, setSelectedOptionListId] = useState('');
  const [selectedOptionListIdForOptions, setSelectedOptionListIdForOptions] = useState(''); // For 2nd part
  const [optionListName, setOptionListName] = useState('');
  const [optionListNameForOptions, setOptionListNameForOptions] = useState(''); // For 2nd part
  const [optionTitle, setOptionTitle] = useState('');
  const [optionPrice, setOptionPrice] = useState('');
  const [newOptions, setNewOptions] = useState([{ optionTitle: '', optionPrice: '' }]);
  const [newOptionsForMenu, setNewOptionsForMenu] = useState([{ optionTitle: '', optionPrice: '' }]); // For 2nd part
  const [showOptionListInput, setShowOptionListInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [optionsOfMenu, setOptionsOfMenu] = useState([]); // For 2nd part

  const handleError = (message) => alert(message);

  const createMenuCategory = async () => {
    const menuCategory = document.getElementById("menu-category").value;
    if (menuCategory) {
      const menuCategoryInfo = { menuCategoryName: menuCategory, storeId: store.storeId };
      try {
        setLoading(true);
        await saveMenuCategory(menuCategoryInfo);
        alert("저장이 완료되었습니다");
        setMenuCategories(prev => [...prev, menuCategoryInfo]);
      } catch {
        handleError("해당 메뉴 카테고리는 이미 존재합니다");
      } finally {
        setLoading(false);
      }
    } else {
      handleError("빈 칸을 채워주세요");
    }
  };

  const getMenuCategories = async () => {
    try {
      setLoading(true);
      const res = await getMenuCategoriesByStoreId(store.storeId);
      setMenuCategories(res);
    } catch {
      handleError("메뉴 카테고리 불러오기에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const saveMenuInfo = async () => {
    const menuCategoryId = document.getElementById("menu-category-select").value;
    const menuName = document.getElementById("menu-name").value;
    const menuIntroduction = document.getElementById("menu-introduction").value;
    const menuPrice = document.getElementById("menu-price").value;

    if (menuCategoryId !== "default" && menuName && menuIntroduction && menuPrice) {
      const saveInfo = { menuName, menuIntroduction, menuPrice, menuCategoryId };
      try {
        setLoading(true);
        await saveMenu(saveInfo);
        alert("저장이 완료되었습니다");
        setMenus(prev => [...prev, saveInfo]);
      } catch {
        handleError("해당 메뉴는 이미 존재합니다");
      } finally {
        setLoading(false);
      }
    } else {
      handleError("빈 칸을 채워주세요");
    }
  };

  const getMenus = async () => {
    const arr = [];
    for (const category of menuCategories) {
      try {
        const res = await getMenuByMenuCategoryId(category.menuCategoryId);
        arr.push(...res);
      } catch {
        handleError("메뉴 불러오기에 실패했습니다");
      }
    }
    setMenus(arr);
  };

  const getOptionListsByStore = async () => {
    try {
      setLoading(true);
      const res = await getOptionListsByStoreId(store.storeId);
      const uniqueOptionLists = res.reduce((acc, item) => {
        if (!acc.find(optionList => optionList.listId === item.listId)) {
          acc.push(item);
        }
        return acc;
      }, []);
      setStoreOptionList(uniqueOptionLists);
    } catch {
      handleError("옵션 카테고리 불러오기에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const createOptionList = async () => {
    const menuId = document.getElementById("menu-select-option-list").value;
    if (menuId !== "default" && optionListName !== "") {
      const optionListRequest = { menuId, listName: optionListName };
      try {
        setLoading(true);
        const res = await saveOptionList(optionListRequest);
        if (res.status === 200) {
          alert("옵션 카테고리가 추가되었습니다");
          setStoreOptionList(prev => [...prev, optionListRequest]); // Update state with new option list
          setOptionListName(''); // Clear input field
        } else {
          alert("해당 옵션 카테고리는 이미 존재합니다");
        }
      } catch (e) {
        alert("해당 옵션 카테고리는 이미 존재합니다");
      } finally {
        setLoading(false);
      }
    } else {
      alert("빈 칸을 채워주세요");
    }
  };

  const createOptionListAndOptions = async (optionListRequest) => {
    try {
      setLoading(true);
      const response = await saveOptionListAndOptions(optionListRequest);
      console.log("API Response:", response);
      alert("옵션 카테고리와 옵션이 추가되었습니다");
      setStoreOptionList(prev => [...prev, optionListRequest]);
    } catch (e) {
      console.error("Error during API call:", e.message);
      handleError("해당 옵션 카테고리 또는 옵션은 이미 존재합니다");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOptionListAndOptions = async () => {
    const menuId = document.getElementById("menu-select-option-list").value;
    if (menuId !== "default" && optionListName !== "" && newOptions.length > 0) {
      const optionListRequest = {
        menuId,
        listName: optionListName,
        options: newOptions
      };
      await createOptionListAndOptions(optionListRequest);
    } else {
      handleError("빈 칸을 채워주세요 또는 옵션을 추가해주세요");
    }
  };

  const handleSaveOptionForMenu = async () => {
    const selectedOptionListId = document.getElementById("option-list-select").value;
    if (selectedOptionListId !== "default" && newOptionsForMenu.length > 0) {
      const optionListRequest = {
        menuId: selectedMenuId,
        listId: selectedOptionListIdForOptions, // Include existing list ID
        listName: optionListNameForOptions,
        options: newOptionsForMenu
      };
      await createOptionListAndOptions(optionListRequest);
    } else {
      handleError("빈 칸을 채워주세요 또는 옵션을 추가해주세요");
    }
  };

  const getOptionListsBySelectedMenu = async () => {
    if (selectedMenuId) {
      try {
        setLoading(true);
        const res = await getOptionListByMenuId(selectedMenuId);
        setOptionListsOfMenu(res);
      } catch {
        handleError("옵션 카테고리 불러오기에 실패했습니다");
      } finally {
        setLoading(false);
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
    if (selectedOptionListIdForOptions && selectedOptionListIdForOptions !== "default") {
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
    const selectedOptionListId = document.getElementById("option-list-select").value;
    const optionTitle = document.getElementById("option-title").value;
    const optionPrice = document.getElementById("option-price").value;

    if (selectedOptionListId !== "default" && optionTitle && optionPrice) {
      try {
        setLoading(true);
        const optionRequest = { optionTitle, optionPrice };
        await saveOption(selectedOptionListId, optionRequest);
        alert("저장이 완료되었습니다");
      } catch {
        handleError("해당 옵션은 이미 존재합니다");
      } finally {
        setLoading(false);
      }
    } else {
      handleError("빈 칸을 채워주세요");
    }
  };

  const handleAddNewOption = () => {
    setNewOptions(prev => [...prev, { optionTitle: '', optionPrice: '' }]);
  };

  const handleRemoveOption = (index) => {
    setNewOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewOptionChange = (index, field, value) => {
    const updatedOptions = newOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
    );
    setNewOptions(updatedOptions);
  };

  const handleAddNewOptionForMenu = () => {
    setNewOptionsForMenu(prev => [...prev, { optionTitle: '', optionPrice: '' }]);
  };

  const handleRemoveOptionForMenu = (index) => {
    setNewOptionsForMenu(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewOptionChangeForMenu = (index, field, value) => {
    const updatedOptions = newOptionsForMenu.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
    );
    setNewOptionsForMenu(updatedOptions);
  };

  useEffect(() => {
    if (store) {
      getMenuCategories();
    }
  }, [store]);

  useEffect(() => {
    if (menuCategories && menuCategories.length > 0) {
      getMenus();
      getOptionListsByStore();
    }
  }, [menuCategories]);

  useEffect(() => {
    if (selectedMenuId) {
      getOptionListsBySelectedMenu();
    }
  }, [selectedMenuId]);

  useEffect(() => {
    if (selectedOptionListId && selectedOptionListId !== "other") {
      getOptionByList();
    }
  }, [selectedOptionListId]);

  useEffect(() => {
    if (selectedOptionListIdForOptions && selectedOptionListIdForOptions !== "other") {
      getOptionsOfMenu();
    }
  }, [selectedOptionListIdForOptions]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  const handleOptionListChange = (e) => {
    const value = e.target.value;
    setSelectedOptionListId(value);
    if (value === 'other') {
      setShowOptionListInput(true);
    } else {
      setShowOptionListInput(false);
      const selectedOptionList = storeOptionList.find(option => option.listId === parseInt(value));
      if (selectedOptionList) {
        setOptionListName(selectedOptionList.listName);
      }
    }
  };

  const handleOptionListChangeForOptions = (e) => {
    const value = e.target.value;
    setSelectedOptionListIdForOptions(value);
    if (value !== "default") {
      const selectedOptionList = optionListsOfMenu.find(option => option.optionListId === parseInt(value));
      if (selectedOptionList) {
        setOptionListNameForOptions(selectedOptionList.listName);
      }
    }
  };

  return (
      <div className='store-container'>
        <h1 className='store-title'>🥑 메뉴 등록</h1>

        <h2 className='store-item'>메뉴 카테고리 추가</h2>
        <div>
          <input id="menu-category" className='store-input' placeholder='메뉴 카테고리를 입력해주세요'/>
        </div>
        <div>
          <button className='menu-save-button' onClick={createMenuCategory} disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
        <hr/>

        <h2 className='store-item'>메뉴 추가</h2>
        <div className='store-input'>
          <input id="image" type='file'/>
        </div>
        <h3 className='store-item'>메뉴 카테고리</h3>
        <div>
          <select className='store-input' id="menu-category-select">
            <option disabled value="default">메뉴 카테고리 선택</option>
            {menuCategories && menuCategories.length > 0 && menuCategories.map((el) => (
                <option key={el.menuCategoryId} value={el.menuCategoryId}>{el.menuCategoryName}</option>
            ))}
          </select>
        </div>
        <h3 className='store-item'>메뉴 이름</h3>
        <div>
          <input id="menu-name" className='store-input' placeholder='메뉴 이름을 입력해주세요'/>
        </div>
        <h3 className='store-item'>메뉴 소개</h3>
        <div>
          <textarea id="menu-introduction" className='store-input' placeholder='메뉴를 소개해주세요' rows={4}/>
        </div>
        <h3 className='store-item'>메뉴 금액</h3>
        <div>
          <input id="menu-price" className='store-input' placeholder='메뉴 금액을 입력해주세요'/>
        </div>
        <div>
          <button className='menu-save-button' onClick={saveMenuInfo} disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
        <hr/>

        <h2 className='store-item'>옵션 카테고리 추가</h2>
        <div>
          <h3 className='store-item'>메뉴 선택</h3>
          <select className='store-input' id="menu-select-option-list">
            <option disabled value="default">메뉴 선택</option>
            {menus && menus.length > 0 && menus.map((el) => (
                <option key={el.menuId} value={el.menuId}>{el.menuName}</option>
            ))}
          </select>
        </div>
        <div>
          <h3 className='store-item'>사용 가능한 옵션 카테고리</h3>
          <h5>'기타' 선택: 새로운 옵션 카테고리와 옵션을 추가합니다</h5>
          <br/>
          <select className='store-input' id="store-option-list-select" onChange={handleOptionListChange}>
            <option disabled value="default">옵션 카테고리 선택</option>
            {storeOptionList && storeOptionList.length > 0 && storeOptionList.map((el) => (
                <option key={el.listId} value={el.listId}>{el.listName}</option>
            ))}
            <option value="other">기타</option>
          </select>
        </div>
        {!showOptionListInput && (
            <OptionListDisplay options={options} optionListName={optionListName} />
        )}
        {showOptionListInput && (
            <NewOptionInput
                newOptions={newOptions}
                handleNewOptionChange={handleNewOptionChange}
                handleAddNewOption={handleAddNewOption}
                handleRemoveOption={handleRemoveOption}
                loading={loading}
            />
        )}
        <div>
          <button className='menu-save-button'
                  onClick={showOptionListInput ? handleSaveOptionListAndOptions : createOptionList} disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
        <hr/>
        
        <h2 className='store-item'>옵션 추가</h2>
        <h5>기존에 있는 옵션 카테고리에 새로운 옵션을 추가합니다</h5>
        <br/>
        <div className='option-select-container'>
          <div className='option-select-item'>
            <select className='store-input' id="menu-select-option" onChange={e => setSelectedMenuId(e.target.value)}
                    value={selectedMenuId}>
              <option disabled value="default">메뉴 선택</option>
              {menus && menus.length > 0 && menus.map((el) => (
                  <option key={el.menuId} value={el.menuId}>{el.menuName}</option>
              ))}
            </select>
          </div>
          <div className='option-select-item'>
            <select id="option-list-select" className='store-input'
                    onChange={handleOptionListChangeForOptions} value={selectedOptionListIdForOptions}>
              <option disabled value="default">옵션 카테고리 선택</option>
              {optionListsOfMenu && optionListsOfMenu.length > 0 ? (
                  optionListsOfMenu.map((el) => (
                      <option key={el.optionListId} value={el.optionListId}>{el.listName}</option>
                  ))
              ) : (
                  <option disabled value="default">옵션 카테고리를 먼저 추가해주세요</option>
              )}
            </select>
          </div>
        </div>
        <div>
          <OptionListDisplay options={optionsOfMenu} optionListName={optionListNameForOptions} />
        </div>
        <br/>
        <NewOptionInput
            newOptions={newOptionsForMenu}
            handleNewOptionChange={handleNewOptionChangeForMenu}
            handleAddNewOption={handleAddNewOptionForMenu}
            handleRemoveOption={handleRemoveOptionForMenu}
            loading={loading}
        />
        <div>
          <button className='menu-save-button' onClick={handleSaveOptionForMenu} disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
  );
};

export default Menu;
