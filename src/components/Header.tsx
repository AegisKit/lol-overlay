import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: #ffffff;
  color: #000000;
  text-align: center;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  left: 2rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  color: white;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
`;

interface HeaderProps {
  onBackToSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBackToSettings }) => {
  return (
    <HeaderContainer>
      <BackButton onClick={onBackToSettings}>戻る</BackButton>
      <Title>M2-TECH</Title>
    </HeaderContainer>
  );
};
