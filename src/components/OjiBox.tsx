import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

interface OjiBoxProps {
  imageName: string;
  altText?: string;
}
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const StyledDiv = styled.div<{ shouldShake: boolean }>`
  width: 83px;
  height: 83px;
  animation: ${({ shouldShake }) => (shouldShake ? shake : "none")} 0.5s
    ease-in-out infinite;
`;

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const OjiBox: React.FC<OjiBoxProps> = ({
  imageName,
  altText = "Image",
}) => {
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldShake(Math.random() < 0.1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StyledDiv shouldShake={shouldShake}>
      <StyledImg src={`${imageName}`} alt={altText} />
    </StyledDiv>
  );
};
