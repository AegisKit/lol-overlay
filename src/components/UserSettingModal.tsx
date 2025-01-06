import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  padding-top: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Input = styled.input`
  margin-top: 1rem;
  padding: 1rem;
  font-size: 1.2rem;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: #45a049;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const UserList = styled.ul`
  margin-top: 1rem;
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 300px;
  text-align: left;
  overflow-y: auto;
  max-height: 150px;
`;

const UserListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
  color: black;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #e53935;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

interface UserSettingModalProps {
  onAddUser: (username: string) => void;
  onConfirm: () => void;
  gridSize: number;
  users: string[];
  onDeleteUser: (username: string) => void;
}

const UserSettingModal: React.FC<UserSettingModalProps> = ({
  onAddUser,
  onConfirm,
  gridSize,
  users,
  onDeleteUser,
}) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (modalRef.current) {
        modalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setError("");
  };

  const handleAddUser = () => {
    if (username.trim()) {
      if (users.length < gridSize) {
        onAddUser(username);
        setUsername("");
      } else {
        setError("最大ユーザー数に達しました。");
      }
    }
  };

  const handleConfirmClick = () => {
    if (username.trim() && users.length < gridSize) {
      onAddUser(username);
    }
    onConfirm();
  };

  return (
    <Overlay>
      <ModalContent ref={modalRef}>
        <h3 style={{ color: "black" }}>ユーザーを追加</h3>
        <Input
          type="text"
          placeholder="ユーザー名を入力"
          value={username}
          onChange={handleInputChange}
          onFocus={(e) =>
            e.target.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleAddUser}
            disabled={!username.trim() || users.length >= gridSize}
          >
            追加
          </Button>
          <Button onClick={handleConfirmClick} disabled={users.length === 0}>
            確定
          </Button>
        </div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <UserList>
          {users.map((user, index) => (
            <UserListItem key={index}>
              {user}
              <DeleteButton onClick={() => onDeleteUser(user)}>
                削除
              </DeleteButton>
            </UserListItem>
          ))}
        </UserList>
      </ModalContent>
    </Overlay>
  );
};

export default UserSettingModal;
