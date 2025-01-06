import React from "react";
import styled, { keyframes } from "styled-components";

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

const growIn = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Outimg = styled.img`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  margin-top: 0;
  border-radius: 10px;
  animation: ${growIn} 0.8s ease-out;
  pointer-events: none;
`;

interface OutModalProps {
  onContinue: () => void;
  outImageUrl: string | null;
}

const OutModal: React.FC<OutModalProps> = ({ onContinue, outImageUrl }) => {
  const outImageUrlText = outImageUrl ? outImageUrl : "/images/mogi-1.png";
  return (
    <Overlay onClick={(e) => e.stopPropagation()}>
      <Outimg src="/images/out-t.png" alt="Out" style={{ width: "281px" }} />
      <Outimg
        src={outImageUrlText}
        alt="OutImage"
        style={{ width: "300px", height: "300px" }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onContinue();
        }}
        style={{
          backgroundColor: "#4CAF50",
          marginTop: "2rem",
          padding: "1rem 2rem",
          fontSize: "1rem",
          cursor: "pointer",
          width: "300px",
          color: "white",
        }}
      >
        コンティニュー
      </button>
    </Overlay>
  );
};

export default OutModal;
