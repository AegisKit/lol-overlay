import React, { useState, useEffect } from "react";
import { OjiBox } from "./OjiBox";
import OutModal from "./OutModal";
import styled, { keyframes } from "styled-components";

const flyAway = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const FlyAwayDiv = styled.div<{ isFlying: boolean; isRemoved: boolean }>`
  animation: ${({ isFlying }) => (isFlying ? flyAway : "none")} 1s forwards;
  visibility: ${({ isRemoved }) => (isRemoved ? "hidden" : "visible")};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

interface OjiFieldProps {
  imageCount: number;
  users: string[];
  normalImage: string;
  outImage: string;
}

export const OjiField: React.FC<OjiFieldProps> = ({
  imageCount,
  users,
  normalImage,
  outImage,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [outImageIndex, setOutImageIndex] = useState<number | null>(null);
  const [flyingIndices, setFlyingIndices] = useState<Set<number>>(new Set());
  const [removedIndices, setRemovedIndices] = useState<Set<number>>(new Set());
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [shouldReset, setShouldReset] = useState<boolean>(false);
  const [currentUserIndex, setCurrentUserIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [shuffledUsers, setShuffledUsers] = useState<string[]>([]);

  useEffect(() => {
    if (shouldReset) {
      initializeGame();
      setShouldReset(false);
    }
  }, [shouldReset]);

  useEffect(() => {
    initializeGame();
  }, [imageCount]);

  const shuffleArray = (array: string[]) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const initializeGame = () => {
    const newImages = Array.from({ length: imageCount }, () => normalImage);
    setImages(newImages);
    setOutImageIndex(Math.floor(Math.random() * imageCount));
    setFlyingIndices(new Set());
    setRemovedIndices(new Set());
    setShowOverlay(false);
    setCurrentUserIndex(0);
    setIsAnimating(false);
    setShuffledUsers(shuffleArray(users));
  };

  const handleClick = (index: number) => {
    if (removedIndices.has(index) || flyingIndices.has(index) || isAnimating)
      return;

    setIsAnimating(true);

    if (index === outImageIndex) {
      setImages((prevImages) =>
        prevImages.map((img, i) => (i === index ? outImage : img))
      );
      setShowOverlay(true);
    } else {
      setFlyingIndices((prev) => new Set(prev).add(index));
      setTimeout(() => {
        setRemovedIndices((prev) => new Set(prev).add(index));
        setFlyingIndices((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
        setIsAnimating(false);
      }, 1000);
    }

    setCurrentUserIndex((prevIndex) => (prevIndex + 1) % shuffledUsers.length);
  };

  return (
    <Container>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <h2>{shuffledUsers[currentUserIndex]}の番です</h2>
      </div>
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: `repeat(3, 1fr)`,
          placeItems: "center",
          placeContent: "center",
          gap: "2rem",
          paddingTop: "2rem",
          paddingRight: "2rem",
          paddingLeft: "2rem",
        }}
      >
        {images.map((imageName, index) => (
          <FlyAwayDiv
            key={index}
            isFlying={flyingIndices.has(index)}
            isRemoved={removedIndices.has(index)}
            onClick={() => handleClick(index)}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OjiBox imageName={imageName} altText={`Image ${index + 1}`} />
          </FlyAwayDiv>
        ))}
      </div>
      {showOverlay && (
        <OutModal
          onContinue={() => setShouldReset(true)}
          outImageUrl={outImage}
        />
      )}
    </Container>
  );
};
