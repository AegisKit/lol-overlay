import React, { useState, useEffect } from "react";
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
  overflow: hidden;
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

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 1rem;
  font-size: 1.2rem;
  width: 180px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const ImagePreview = styled.img`
  margin-left: 1rem;
  max-width: 50px;
  max-height: 50px;
  border-radius: 5px;
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

const ResetButton = styled.button`
  position: absolute;
  top: 50px;
  left: 20px;
  padding: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: #e53935;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 1rem;
`;

interface IconSettingModalProps {
  onClose: () => void;
}

const IconSettingModal: React.FC<IconSettingModalProps> = ({ onClose }) => {
  const [normalImage, setNormalImage] = useState<File | null>(null);
  const [outImage, setOutImage] = useState<File | null>(null);
  const [normalImageUrl, setNormalImageUrl] = useState<string | null>(null);
  const [outImageUrl, setOutImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedNormalImage = localStorage.getItem("normalImage");
    const storedOutImage = localStorage.getItem("outImage");
    if (storedNormalImage) {
      setNormalImageUrl(storedNormalImage);
    }
    if (storedOutImage) {
      setOutImageUrl(storedOutImage);
    }
  }, []);

  const handleNormalImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setNormalImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setNormalImageUrl(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleOutImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setOutImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setOutImageUrl(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const resizeAndSaveImage = (
    file: File,
    fileWidth: number,
    callback: (dataUrl: string) => void
  ) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const newHeight = fileWidth * aspectRatio;

      const canvas = document.createElement("canvas");
      canvas.width = fileWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, fileWidth, newHeight);
      }

      const resizedImgDataUrl = canvas.toDataURL("image/jpeg");
      callback(resizedImgDataUrl);
    };
  };

  const handleUpload = () => {
    if (!normalImage && !outImage) {
      setError("少なくとも1つの画像を選択してください。");
      return;
    }

    setError(""); // エラーメッセージをクリア

    let normalImageProcessed = false;
    let outImageProcessed = false;

    const checkAndClose = () => {
      if (
        (normalImage || normalImageProcessed) &&
        (outImage || outImageProcessed)
      ) {
        onClose();
      }
    };

    if (normalImage) {
      resizeAndSaveImage(normalImage, 300, (normalDataUrl) => {
        localStorage.setItem("normalImage", normalDataUrl);
        normalImageProcessed = true;
        checkAndClose();
      });
    } else {
      normalImageProcessed = true;
    }

    if (outImage) {
      resizeAndSaveImage(outImage, 1000, (outDataUrl) => {
        localStorage.setItem("outImage", outDataUrl);
        outImageProcessed = true;
        checkAndClose();
      });
    } else {
      outImageProcessed = true;
    }
  };

  const handleReset = () => {
    localStorage.removeItem("normalImage");
    localStorage.removeItem("outImage");
    setNormalImageUrl(null);
    setOutImageUrl(null);
  };

  return (
    <Overlay>
      <ModalContent>
        <ResetButton onClick={handleReset}>リセット</ResetButton>
        <h3 style={{ color: "black" }}>通常画像</h3>
        <InputContainer>
          <Input
            type="file"
            accept="image/*"
            onChange={handleNormalImageChange}
          />
          {normalImageUrl && (
            <ImagePreview src={normalImageUrl} alt="Normal Image Preview" />
          )}
        </InputContainer>
        <h3 style={{ color: "black" }}>アウト画像</h3>
        <InputContainer>
          <Input type="file" accept="image/*" onChange={handleOutImageChange} />
          {outImageUrl && (
            <ImagePreview src={outImageUrl} alt="Out Image Preview" />
          )}
        </InputContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button onClick={handleUpload}>アップロード</Button>
        <Button onClick={onClose}>アップロードせずに始める</Button>
      </ModalContent>
    </Overlay>
  );
};

export default IconSettingModal;
