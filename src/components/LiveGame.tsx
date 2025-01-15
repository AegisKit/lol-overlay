import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { api } from "../api/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  max-width: 640px;
  width: 100%;
  height: 160px;
`;

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: top;
  width: 100%;
  height: 35px;
`;

const BotRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const LiveIndicator = styled.div`
  color: white;
  border-radius: 5px;
  font-weight: bold;
  font-size: 25px;
  z-index: 1;
  animation: ${blink} 5s infinite;
  margin-left: 40px;
  &::before {
    content: "🔴";
    margin-right: 5px;
    font-size: 20px;
  }
`;

const BannedChampionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 100%;
`;

const BannedChampion = styled.div`
  display: flex;
  flex-direction: row; /* 横並びに設定 */
  justify-content: center;
  align-items: center;
  height: 35px;
  width: 35px;
  padding-top: 0;
  position: relative; /* 線を引くために必要 */
  border: 2px solid #d40000;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none; /* クリックを無効にする */
    background: linear-gradient(
      45deg,
      transparent 0%,
      transparent 47%,
      #d40000 47%,
      #d40000 53%,
      transparent 53%,
      transparent 100%
    );
  }

  img {
    width: 35px;
    height: 35px;
    filter: grayscale(100%);
  }
`;

const RuneContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding: 0px;
  height: 40px;
`;

interface IconProps {
  borderColor: string;
}

const MainRuneIcon = styled.img<IconProps>`
  width: 35px; /* メインルーンアイコンを大きく */
  height: 35px;
  margin: 10px;
  border-radius: 50%;
  transition: transform 0.2s;
  padding: 2px;
  border: 2px solid ${({ borderColor }) => borderColor};
  position: relative;
  background: linear-gradient(200deg, #12211e, #1a3a34);
`;

const SmallRuneIcon = styled.img<IconProps>`
  width: 30px; /* 各ルーンアイコンを小さく */
  height: 30px;
  margin: 5px;
  border-radius: 50%;
  transition: transform 0.2s;
  padding: 2px;
  border: 2px solid ${({ borderColor }) => borderColor};
  position: relative;
  background: linear-gradient(200deg, #12211e, #1a3a34);
`;

const ShardIcon = styled.img<{ isFirst: boolean }>`
  width: 25px;
  height: 25px;
  margin: 5px;
  border-radius: 50%;
  padding: 2px;
  border: 1px solid #b8860b;
  background-color: #181d27;
  margin-left: ${({ isFirst }) => (isFirst ? "15px" : "0")};
`;

const IconImage = styled.img`
  width: 90px;
  height: 90px;
  margin-bottom: 2px;
  margin-right: 20px;
  position: relative;
  z-index: 1;
  left: -80px;
  top: 2px;
  border-radius: 50%;
  border: 3px solid #ffd700 0.9;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const MainRuneLine = styled.div`
  position: absolute;
  top: 50%;
  left: 42%;
  width: 150px;
  height: 10px;
  background-color: #181d27;
  margin: 0;
  border: 1px solid #273040;
  z-index: -1;
  transform: translateY(-50%);
`;

const SubRuneLine = styled.div`
  position: absolute;
  top: 81%;
  left: 42%;
  width: 120px;
  height: 10px;
  background-color: #181d27;
  margin: 0;
  border: 1px solid #273040;
  z-index: -1;
  transform: translateY(-50%);
`;

const RuneColors = {
  Domination: "#d95757",
  Whimsy: "#42707f",
  Precision: "#857154",
  Resolve: "#356b38",
  Sorcery: "#5e4eab",
};

interface LiveGameProps {
  gameInfo: any;
  summonerId: string;
}

export const LiveGame = ({ gameInfo, summonerId }: LiveGameProps) => {
  const [bannedChampionUrls, setBannedChampionUrls] = useState<string[]>([]);
  const [runeIcons, setRuneIcons] = useState<any>(null);
  const [userIconUrl, setUserIconUrl] = useState<string>("");
  const [mainRuneColor, setMainRuneColor] = useState<string>(
    RuneColors.Domination
  );
  const [subRuneColor, setSubRuneColor] = useState<string>(
    RuneColors.Domination
  );

  useEffect(() => {
    const fetchBannedChampionUrls = async () => {
      const urls = await Promise.all(
        gameInfo.bannedChampions.map((champion: any) =>
          api.getChampionIconUrlFromId(champion.championId)
        )
      );
      setBannedChampionUrls(
        Array.from(new Set(urls.filter((url) => !url.includes("undefined"))))
      );
    };

    fetchBannedChampionUrls();
  }, [gameInfo.bannedChampions]);

  useEffect(() => {
    const fetchRunes = async () => {
      const user = gameInfo.participants.find(
        (participant) => participant.summonerId === summonerId
      );
      setUserIconUrl(
        `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${user.profileIconId}.png`
      );
      const r = await api.getRuneIcons(user.perks);
      setRuneIcons(r);
      const mainRuneMatch = r.mainRune.icon.match(/\/(\d+)_([a-zA-Z]+)\.png$/);
      const subRuneMatch = r.subRune.icon.match(/\/(\d+)_([a-zA-Z]+)\.png$/);
      setMainRuneColor(RuneColors[mainRuneMatch[2] as keyof typeof RuneColors]);
      setSubRuneColor(RuneColors[subRuneMatch[2] as keyof typeof RuneColors]);
    };
    fetchRunes();
  }, [gameInfo.participants]);

  return (
    <Container>
      <TopRow>
        <LiveIndicator>LIVE</LiveIndicator>
        <BannedChampionContainer>
          {bannedChampionUrls && bannedChampionUrls.length > 0 ? (
            bannedChampionUrls.map((url: string, index: number) => (
              <BannedChampion key={index}>
                <img src={url} alt={`Banned Champion ${index}`} />
              </BannedChampion>
            ))
          ) : (
            <div>No champions banned</div>
          )}
        </BannedChampionContainer>
      </TopRow>
      <BotRow>
        <IconImage src={userIconUrl} alt={gameInfo.profileIconId} />
        {runeIcons && (
          <div>
            <RuneContainer>
              <MainRuneIcon
                src={runeIcons.mainRune.icon}
                alt="Main Rune Icon"
                borderColor={mainRuneColor}
              />
              <MainRuneLine />
              {runeIcons.mainRune.runes.map((rune, index) => (
                <SmallRuneIcon
                  src={rune}
                  alt={`Main Rune ${index}`}
                  borderColor={mainRuneColor}
                />
              ))}
            </RuneContainer>
            <RuneContainer>
              <MainRuneIcon
                src={runeIcons.subRune.icon}
                alt="Sub Rune Icon"
                borderColor={subRuneColor}
              />
              <SubRuneLine />
              {runeIcons.subRune.runes.map((rune, index) => (
                <SmallRuneIcon
                  src={rune}
                  alt={`Sub Rune ${index}`}
                  borderColor={subRuneColor}
                />
              ))}
              {runeIcons.shards.map((shard, index) => (
                <ShardIcon
                  src={shard}
                  alt={`Shard ${index}`}
                  isFirst={index === 0}
                />
              ))}
            </RuneContainer>
          </div>
        )}
      </BotRow>
    </Container>
  );
};
