import { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { OjiField } from "./components/OjiField";
import { Header } from "./components/Header";
import GridSettingModal from "./components/GridSettingModal";
import UserSettingModal from "./components/UserSettingModal";
import IconSettingModal from "./components/IconSettingModal";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
`;

function App() {
  const [gridSize, setGridSize] = useState<number | null>(null);
  const [showUserSetting, setShowUserSetting] = useState(false);
  const [showIconSetting, setShowIconSetting] = useState(false);
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      event.preventDefault();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("scroll", handleScroll, { passive: false });

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateVh();
    window.addEventListener("resize", updateVh);

    return () => {
      window.removeEventListener("resize", updateVh);
    };
  }, []);

  const handleGridSizeSelect = (size: number) => {
    setGridSize(size);
    setShowUserSetting(true);
  };

  const handleIconSettingClose = () => {
    setShowIconSetting(false);
  };

  const handleAddUser = (username: string) => {
    if (gridSize !== null && users.length < gridSize) {
      const newUsers = [...users, username];
      setUsers(newUsers);
      localStorage.setItem("users", JSON.stringify(newUsers));
    }
  };

  const handleDeleteUser = (username: string) => {
    const newUsers = users.filter((user) => user !== username);
    setUsers(newUsers);
    localStorage.setItem("users", JSON.stringify(newUsers));
  };

  const handleConfirm = () => {
    setShowUserSetting(false);
    setShowIconSetting(true);
  };

  const handleBackToSettings = () => {
    setGridSize(null);
    setShowUserSetting(true);
    setShowIconSetting(false);
  };

  const setFillHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  window.addEventListener("resize", setFillHeight);
  setFillHeight();

  const getBlobFromBase64 = (base64Data: string) => {
    const byteString = atob(base64Data.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], { type: "image/png" });
  };

  const normalImageData = localStorage.getItem("normalImage");
  const normalImageUrl = normalImageData
    ? URL.createObjectURL(getBlobFromBase64(normalImageData))
    : "/images/kawaida-1.png";

  const outImageData = localStorage.getItem("outImage");
  const outImageUrl = outImageData
    ? URL.createObjectURL(getBlobFromBase64(outImageData))
    : "/images/mogi-1.png";

  return (
    <>
      <GlobalStyle />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Header onBackToSettings={handleBackToSettings} />
        <div
          style={{
            flex: 1,
            backgroundImage: "url(/images/oji-bg.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "2rem",
            overflow: "hidden",
          }}
        >
          {gridSize === null ? (
            <GridSettingModal onSelect={handleGridSizeSelect} />
          ) : showUserSetting ? (
            <UserSettingModal
              onAddUser={handleAddUser}
              onConfirm={handleConfirm}
              gridSize={gridSize}
              users={users}
              onDeleteUser={handleDeleteUser}
            />
          ) : showIconSetting ? (
            <IconSettingModal onClose={handleIconSettingClose} />
          ) : (
            <OjiField
              imageCount={gridSize}
              users={users}
              normalImage={normalImageUrl}
              outImage={outImageUrl}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
