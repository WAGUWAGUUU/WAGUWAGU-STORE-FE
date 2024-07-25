import Delivery from "../components/Delivery"
import Store from "../components/Store"
import Menu from "../components/Menu"
import './MyStore.css'
import { useEffect, useState } from "react"
import { getStoreByOwnerId } from "../api/Store"

const MyStore = () => {
  const [store, setStore] = useState(null);

  const getStore = async () => {
    // const ownerId = localStorage.getItem("id");
    // const res = getStoreByOwnerId(ownerId); 
    const res = await getStoreByOwnerId(1);
    setStore(res);
  }

  useEffect(() => {
    getStore();
  }, []);

  return (
    <>
      <div className="mystore-container">
        <div className="mystore-left">
          <Store store={store} setStore={setStore}/>
          <Delivery store={store} setStore={setStore} />
        </div>
        <div className="mystore-right">
          <Menu store={store} setStore={setStore} />
        </div>
      </div>
    </>
  )
}

export default MyStore
