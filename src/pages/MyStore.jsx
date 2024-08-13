import Delivery from "../components/Delivery";
import Store from "../components/Store";
import Menu from "../components/Menu";
import "./MyStore.css";
import { useEffect, useState } from "react";
import { getStoreByOwnerIdQL } from "../config/storeGraphQL";

const MyStore = () => {
  const [store, setStore] = useState(null);
  const [websocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const getStore = async () => {
    const ownerId = localStorage.getItem("ownerId");
    const res = await getStoreByOwnerIdQL({ ownerId: ownerId });
    setStore(res);
  };

  useEffect(() => {
    getStore();
  }, []);

  useEffect(() => {
    if (store && store.storeId) {
      connectWebSocket(store.storeId);
    }

    // Clean up WebSocket on component unmount or when store.storeId changes
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [store]);

  const connectWebSocket = (storeId) => {
    let reconnectInterval = 5000; // 5 seconds

    const establishConnection = () => {
      try {
        const ws = new WebSocket(`ws://192.168.0.15:8000/ws/store/${storeId}`);

        ws.onopen = () => {
          console.log("WebSocket connected");
          reconnectInterval = 5000; // Reset reconnect interval on successful connection
        };

        ws.onmessage = (event) => {
          console.log("Message from server:", event.data);
          setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
          setTimeout(() => establishConnection(), reconnectInterval);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          ws.close(); // Close the socket and retry on error
        };

        setWebSocket(ws);
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        setTimeout(() => establishConnection(), reconnectInterval);
      }
    };

    establishConnection();
  };

  return (
      <>
        <div className="mystore-container">
          <div className="mystore-left">
            <Store store={store} setStore={setStore} />
            <Delivery store={store} setStore={setStore} />
          </div>
          <div className="mystore-right">
            <Menu store={store} setStore={setStore} />
          </div>
        </div>
      </>
  );
};

export default MyStore;
