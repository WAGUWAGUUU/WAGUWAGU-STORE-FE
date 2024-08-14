import Delivery from "../components/Delivery";
import Store from "../components/Store";
import Menu from "../components/Menu";
import "./MyStore.css";
import { useEffect, useState, useCallback } from "react";
import { getStoreByOwnerIdQL } from "../config/storeGraphQL";

const MyStore = () => {
  const [store, setStore] = useState(null);
  const [websocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  const getStore = async () => {
    const ownerId = localStorage.getItem("ownerId");
    try {
      const res = await getStoreByOwnerIdQL({ ownerId });
      setStore(res);
    } catch (error) {
      console.error("Failed to fetch store:", error);
    }
  };

  useEffect(() => {
    getStore();
  }, []);

  const connectWebSocket = useCallback((storeId) => {
    let reconnectInterval = 5000; // Initial reconnect interval

    const establishConnection = () => {
      try {
        console.log("Establishing WebSocket connection...");
        const ws = new WebSocket(`ws://192.168.0.15:8000/ws/store/${storeId}`);

        ws.onopen = () => {
          console.log("WebSocket connected");
          console.log("WebSocket readyState:", ws.readyState);
          reconnectInterval = 5000; // Reset reconnect interval on successful connection
        };

        ws.onmessage = (event) => {
          if (typeof event.data === 'string') {
            console.log("Text message received from server:", event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);

            // Handle specific message types
            if (event.data === "주문이 도착했습니다.") {
              alert("주문이 도착했습니다.");
              notifyAndPlayAudio();
              // Additional handling (e.g., UI updates, audio notifications) can be added here
            }
          } else {
            console.log("Unknown message type received");
          }
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
          reconnectInterval = Math.min(reconnectInterval * 2, 60000); // Exponential backoff, max 60 seconds
          setTimeout(establishConnection, reconnectInterval);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error occurred:", error);
          ws.close(); // Close the socket and trigger reconnect
        };

        setWebSocket(ws);
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        setTimeout(establishConnection, reconnectInterval);
      }
    };

    establishConnection();
  }, []);

  const notifyAndPlayAudio = async () => {
    try {
      const response = await fetch("http://192.168.0.15:8000/notify/order-arrived", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const arrayBuffer = await blobToArrayBuffer(blob);
        const base64String = arrayBufferToBase64(arrayBuffer);

        // Create a blob URL for the audio file
        const audioUrl = `data:audio/mp3;base64,${base64String}`;

        // Create a new Audio object and play it
        const audio = new Audio(audioUrl);
        audio.play();

        // Optional: Add an event listener to clean up after the audio is played
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);  // Release the object URL
          console.log('Audio playback finished');
        };
      } else {
        console.error("Failed to notify:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch and play audio:", error);
    }
  };

// Helper function to convert Blob to ArrayBuffer
  const blobToArrayBuffer = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read blob as array buffer.'));
      reader.readAsArrayBuffer(blob);
    });
  };

// Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);  // Convert binary string to base64
  };

  useEffect(() => {
    if (store && store.storeId && !websocket) {
      console.log(`Attempting to connect WebSocket for store ID: ${store.storeId}`);
      connectWebSocket(store.storeId);
    }

    // Cleanup on component unmount or when store changes
    return () => {
      if (websocket) {
        console.log("Closing WebSocket connection");
        websocket.close();
      }
    };
  }, [store, websocket, connectWebSocket]);

  return (
      <div className="mystore-container">
        <div className="mystore-left">
          <Store store={store} setStore={setStore} />
          <Delivery store={store} setStore={setStore} />
        </div>
        <div className="mystore-right">
          <Menu store={store} setStore={setStore} />
        </div>
      </div>
  );
};

export default MyStore;
