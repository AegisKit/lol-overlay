import React, { useState } from "react";
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
  align-items: center;
  z-index: 1000;
  transition: transform 0.8s ease;
  flex-direction: column;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Select = styled.select`
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100px;
`;

const Button = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
`;

interface GridSettingsModalProps {
  onSelect: (size: number) => void;
}

const GridSettingsModal: React.FC<GridSettingsModalProps> = ({ onSelect }) => {
  const [selectedSize, setSelectedSize] = useState<number>(9);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(Number(event.target.value));
  };

  const handleConfirm = () => {
    onSelect(selectedSize);
  };

  return (
    <Overlay>
      <ModalContent>
        <h3 style={{ color: "#000000" }}>画像の数を選択</h3>
        <Select value={selectedSize} onChange={handleSelectChange}>
          <option value={9}>9</option>
          <option value={12}>12</option>
        </Select>
        <Button onClick={handleConfirm}>決定</Button>
      </ModalContent>
    </Overlay>
  );
};

export default GridSettingsModal;
