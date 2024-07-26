import { useEffect, useState } from 'react'
import { getMenuCategoriesByStoreId, saveMenuCategory } from '../api/MenuCategory'
import './Menu.css'
import { getMenuByMenuCategoryId, saveMenu } from '../api/Menu';
import { getOptionListByMenuId, saveOptionList } from '../api/OptionList';
import { saveOption } from '../api/Option';

const Menu = ({store, setStore}) => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [menuCategoriesAdded, setMenuCategoriesAdded] = useState(null);
  const [menus, setMenus] = useState([]);
  const [menuAdded, setMenuAdded] = useState(null);
  const [optionListAdded, setOptionListAdded] = useState(null);
  const [optionLists, setOptionLists] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState();

  const createMenuCategroy = async () => {
    const menuCategory = document.getElementById("menu-category").value;
    if (menuCategory !== "") {
      const menuCategoryInfo = {menuCategoryName: menuCategory, storeId: store.storeId};
      try {
        await saveMenuCategory(menuCategoryInfo);
        alert("저장이 완료되었습니다");
        setMenuCategoriesAdded({}); // 
      } catch (e) {
        alert("해당 메뉴 카테고리는 이미 존재합니다");  
      }
    } else alert("빈 칸을 채워주세요");
  }

  const getMenuCategories = async () => {
    const res = await getMenuCategoriesByStoreId(store.storeId);
    setMenuCategories(res);
  }
  
  const saveMenuInfo = async () => {
    const menuCategoryId = document.getElementById("menu-category-select").value;
    const menuName = document.getElementById("menu-name").value;
    const menuIntroduction = document.getElementById("menu-introduction").value;
    const menuPrice = document.getElementById("menu-price").value;

    if (menuCategoryId !== "default" 
    && menuName !== ""
    && menuIntroduction !== ""
    && menuPrice !== ""
    ) {
      const saveInfo = {menuName : menuName, menuIntroduction: menuIntroduction, menuPrice: menuPrice, menuCategoryId: menuCategoryId};
      try {
        await saveMenu(saveInfo);
        alert("저장이 완료되었습니다");
        setMenuAdded({});
      } catch (e) {
        alert("해당 메뉴는 이미 존재합니다");  
      }
    } else alert("빈 칸을 채워주세요");
  };

  const getMenus = async () => {
    const arr = [];
    for (let category of menuCategories) {
      const res = await getMenuByMenuCategoryId(category.menuCategoryId);
      for (let menu of res) {
        arr.push(menu);
      };
    };
    setMenus(arr);
  }

  const createOptionList = async () => {
    const menuId = document.getElementById("menu-select").value;
    const optionListName = document.getElementById("option-list-name").value;
    console.log(menuId);
    console.log(optionListName);
    if (menuId !== "default" && optionListName !== "") {
      const optionListRequest = {menuId : menuId, listName: optionListName};
      console.log(optionListRequest);
      try {
        await saveOptionList(optionListRequest);
        alert("저장이 완료되었습니다");
        setOptionListAdded({});
      } catch(e) {
        alert("해당 옵션은 카테고리는 이미 존재합니다"); 
      }
    } else alert("빈 칸을 채워주세요");
  }
  
  
  const getOptionLists = async () => {
    const arr = [];
    for (let menu of menus) {
      try {
        const res = await getOptionListByMenuId(menu.menuId);
        for (let optionList of res) {
          arr.push(optionList);
        };
      } catch(e) {
        continue; // 옵션 카테고리를 안 갖고 있는 메뉴는 뛰어 넘는다.
      } 
    };
    setOptionLists(arr);
  }

  const getOptionListsBySelectedMenu = async () => {
    try {
      const res = await getOptionListByMenuId(selectedMenuId);
      setOptionLists(res);
    } catch (e) {
      console.log("없어요~");
      setOptionLists([]);
    }
  };

  const createOption = async () => {
    const selectedOptionListId = document.getElementById("option-list-select").value;
    const optionTitle = document.getElementById("option-title").value;
    const optionPrice = document.getElementById("option-price").value;
    if (selectedOptionListId !== "default" 
    && optionTitle !== ""
    && optionPrice !== ""
    ) {
      try {
        const optionRequest = {optionTitle: optionTitle, optionPrice: optionPrice};
        await saveOption(selectedOptionListId, optionRequest);
        alert("저장이 완료되었습니다");
      } catch(e) {
        alert("해당 옵션은 이미 존재합니다"); 
      }
    } else alert("빈 칸을 채워주세요");
  }


  useEffect(() => {
    getMenuCategories();
  }, [menuCategoriesAdded, store]);

  useEffect(() => {
    getMenus();
  }, [menuAdded, menuCategories]);

  useEffect(() => {
    getOptionLists();
  }, [optionListAdded, menus]);

  useEffect(() => {
    console.log("가져온다 실시")
    getOptionListsBySelectedMenu();
  }, [selectedMenuId]);

  return (
    <>
      <div className='store-container'>
        <h1 className='store-title'>🥑 메뉴 등록</h1>
        <h2 className='store-item'>메뉴 카테고리 추가</h2>
        <div>
          <input id="menu-category" className='store-input' placeholder='메뉴 카테고리를 입력해주세요'/>
        </div>
        <div>
          <button className='menu-save-button' onClick={createMenuCategroy}>저장</button>
        </div>
        <hr />
        <h2 className='store-item'>메뉴 추가</h2>
        <div className='store-input'>
          <input id="image" type='file'/>
        </div>
        <h3 className='store-item'>메뉴 카테고리</h3>
        <div>
          <select className='store-input' id="menu-category-select">
            <option disabled selected hidden value="default">메뉴 카테고리 선택</option>
            {menuCategories && menuCategories.length > 0 && menuCategories.map((el,i) => {
              return (<option key={el.menuCategoryId + el.menuCategoryName} value={el.menuCategoryId}>{el.menuCategoryName}</option>)
            })}
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
          <button className='menu-save-button' onClick={saveMenuInfo}>저장</button>
        </div>
        <hr />
        <h2 className='store-item'>옵션 카테고리 추가</h2>
        <div>
          <select className='store-input' id="menu-select">
            <option disabled selected hidden value="default">메뉴 선택</option>
            {menus && menus.length > 0 && menus.map((el,i) => {
              return (<option key={el.menuId + el.menuName} value={el.menuId}>{el.menuName}</option>)
            })}
          </select>
        </div>
        <div>
          <input id="option-list-name" className='store-input' placeholder='옵션 카테고리를 입력해주세요'/>
        </div>
        <div>
          <button className='menu-save-button' onClick={createOptionList}>저장</button>
        </div>
        <hr />
        <h2 className='store-item'>옵션 추가</h2>
        <div className='option-select-container'>
          <div className='option-select-item'>
            <select className='store-input' id="menu-select" onChange={e => setSelectedMenuId(e.target.value)}>
              <option disabled selected hidden value="default">메뉴 선택</option>
              {menus && menus.length > 0 && menus.map((el,i) => {
                return (<option key={el.menuId + el.menuName} value={el.menuId}>{el.menuName}</option>)
              })}
            </select>
          </div>
          <div className='option-select-item'>
            <select id="option-list-select" className='store-input'>
              {optionLists.length === 0 && <option disabled selected hidden value="default">옵션 카테고리를 먼저 추가해주세요</option>}
              <option disabled selected hidden value="default">옵션 카테고리 선택</option>
              {optionLists && optionLists.length > 0 && optionLists.map((el,i) => {
                console.log(el);
                return (<option key={el.listId + el.listName} value={el.optionListId}>{el.listName}</option>)
              })}
            </select>
          </div>
        </div>
        <h3 className='store-item'>옵션 제목</h3>
        <div>
          <input id="option-title" className='store-input' placeholder='옵션 제목을 소개해주세요'/>
        </div>
        <h3 className='store-item'>옵션 금액</h3>
        <div>
          <input id="option-price" className='store-input' placeholder='옵션 금액을 입력해주세요'/>
        </div>
        <div>
          <button className='menu-save-button' onClick={createOption}>저장</button>
        </div>
      </div>
    </>
  )
}

export default Menu
