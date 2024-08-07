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
import NewOptionInput from './NewOptionInput';

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
  const [newOptionsForOptions, setNewOptionsForOptions] = useState([{ optionTitle: '', optionPrice: '' }]); // For 2nd part
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

  const createOptionListAndOptions = async (menuId, optionListName, options) => {
    if (menuId !== "default" && optionListName !== "" && options.length > 0) {
      for (const option of options) {
        if (!option.optionTitle || !option.optionPrice) {
          alert('빈 칸을 모두 채워주세요.');
          return;
        }
      }

      const optionListRequest = {
        menuId,
        listName: optionListName,
        options: options
      };

      try {
        setLoading(true);
        const response = await saveOptionListAndOptions(optionListRequest);

        // Log the response data
        console.log("API Response:", response);

        // Handle the response based on the expected result
        alert("옵션 카테고리와 옵션이 추가되었습니다");
        setStoreOptionList(prev => [...prev, optionListRequest]);
      } catch (e) {
        console.error("Error during API call:", e.message);
        handleError("해당 옵션 카테고리 또는 옵션은 이미 존재합니다");
      } finally {
        setLoading(false);
      }
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
    if (selectedOptionListIdForOptions !== "default" && newOptionsForOptions.length > 0) {
      for (const option of newOptionsForOptions) {
        if (!option.optionTitle || !option.optionPrice) {
          alert('빈 칸을 모두 채워주세요.');
          return;
        }
      }

      const optionListRequest = {
        menuId: selectedMenuId,
        listName: optionListNameForOptions,
        options: newOptionsForOptions
      };

      try {
        setLoading(true);
        const response = await saveOptionListAndOptions(optionListRequest);

        // Log the response data
        console.log("API Response:", response);

        // Handle the response based on the expected result
        alert("옵션이 추가되었습니다");
        setOptionsOfMenu(prev => [...prev, ...newOptionsForOptions]);
        setNewOptionsForOptions([{ optionTitle: '', optionPrice: '' }]); // Clear the input fields
      } catch (e) {
        console.error("Error during API call:", e.message);
        handleError("해당 옵션 또는 옵션 카테고리는 이미 존재합니다");
      } finally {
        setLoading(false);
      }
    } else {
      handleError("빈 칸을 채워주세요 또는 옵션을 추가해주세요");
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

  const handleAddNewOptionForOptions = () => {
    setNewOptionsForOptions(prev => [...prev, { optionTitle: '', optionPrice: '' }]);
  };

  const handleRemoveOptionForOptions = (index) => {
    setNewOptionsForOptions(prev => prev.filter((_, i) => i !== index));
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
          <input id="menu-category" className='store-input' placeholder='메뉴 카테고리를 입력해주세요' />
        </div>
        <div>
          <button className='menu-save-button' onClick={createMenuCategory} disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
        <hr />

        <h2 className='store-item'>메뉴 추가</h2>
        <div className='store-input'>
          <input id="image" type='file' />
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
          <input id="menu-name" className='store-input' placeholder='메뉴 이름을 입력해주세요' />
        </div>
        <h3 className='store-item'>메뉴 소개</h3>
        <div>
          <textarea id="menu-introduction" className='store-input' placeholder='메뉴를 소개해주세요' rows={4} />
        </div>
        <h3 className='store-item'>메뉴 금액</h3>
        <div>
          <input id="menu-price" className='store-input' placeholder='메뉴 금액을 입력해주세요' />
        </div>
        <div>
          <button className='menu-save-button' onClick={saveMenuInfo} disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
        <hr />

        {/* 1번 */}
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
          <select className='store-input' id="store-option-list-select" onChange={handleOptionListChange}>
            <option disabled value="default">옵션 카테고리 선택</option>
            {storeOptionList && storeOptionList.length > 0 && storeOptionList.map((el) => (
                <option key={el.listId} value={el.listId}>{el.listName}</option>
            ))}
            <option value="other">기타</option>
          </select>
        </div>
        {!showOptionListInput && (
            <div>
              <h3 className='store-item'>{optionListName}의 옵션</h3>
              <OptionDisplay options={options} />
            </div>
        )}
        {showOptionListInput && (
            <div>
              <h3>옵션리스트 추가하기</h3>
              <input
                  id="option-list-name"
                  className='store-input'
                  placeholder='옵션 카테고리 이름'
                  value={optionListName}
                  onChange={e => setOptionListName(e.target.value)}
              />
              <NewOptionInput
                  newOptions={newOptions}
                  handleNewOptionChange={handleNewOptionChange}
                  handleAddNewOption={handleAddNewOption}
                  handleRemoveOption={handleRemoveOption}
                  loading={loading}
              />
            </div>
        )}
        <div>
          <button className='menu-save-button'
                  onClick={showOptionListInput ? () => createOptionListAndOptions(selectedMenuId, optionListName, newOptions) : createOptionList}
                  disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
        <hr />

        {/* 2번 */}
        <h2 className='store-item'>옵션 추가</h2>
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
          <h3 className='store-item'>{optionListNameForOptions}의 옵션</h3>
          <OptionDisplay options={optionsOfMenu} />
        </div>
        <NewOptionInput
            newOptions={newOptionsForOptions}
            handleNewOptionChange={handleNewOptionChangeForOptions}
            handleAddNewOption={handleAddNewOptionForOptions}
            handleRemoveOption={handleRemoveOptionForOptions}
            loading={loading}
        />
        <div>
          <button className='menu-save-button' onClick={createOption} disabled={loading}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
  );
};

const OptionDisplay = ({ options }) => (
    <div style={{
      backgroundColor: '#94D35C', // 배경색
      borderRadius: '10px', // 모서리 둥글기
      padding: '20px', // 내부 여백
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 그림자
      margin: '10px 0' // 외부 여백
    }}>
      {options && options.length > 0 ? (
          options.map((option) => (
              <div key={option.optionId}>
                <span>{option.optionTitle}</span> - <span>{option.optionPrice}원</span>
              </div>
          ))
      ) : (
          <p>옵션이 없습니다</p>
      )}
    </div>
);

export default Menu;
