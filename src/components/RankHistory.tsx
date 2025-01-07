import styled from "styled-components";
import { RankMap } from "../RankMap";

const StatsContainer = styled.div<{ tier: string }>`
  display: flex;
  gap: 35px;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  max-width: 640px;
  width: 100%;
  height: 160px;
  background: ${(props) => RankMap[props.tier].color || "transparent"};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatItemText = styled.p`
  margin: 0;
  font-size: 25px;
  color: #fff;
  font-weight: bold;
`;

const StateItemLabel = styled.p`
  margin: 0;
  font-size: 18px;
  color: #ffd700;
  opacity: 0.8;
`;

interface RankHistoryProps {
  rankHistory: any;
  summonerInfo: any;
}

const IconImage = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 2px;
  position: relative;
  z-index: 1;
  left: -9px;
  top: 2px;
  border-radius: 50%;
  border: 3px solid #ffd700 0.9;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

const RankImage = styled.img`
  width: 100px;
  height: 100px;
  margin-bottom: 2px;
`;

const RankInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
  top: -10px;
`;

const RankText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  position: absolute;
  bottom: -15px;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
`;

const queueTypeMap = {
  RANKED_SOLO_5x5: "Solo",
  RANKED_FLEX_SR: "Flex",
};

export const RankHistory = ({
  rankHistory,
  summonerInfo,
}: RankHistoryProps) => {
  if (!rankHistory) return null;

  const winRate = (
    (rankHistory.wins / (rankHistory.wins + rankHistory.losses)) *
    100
  ).toFixed(1);

  return (
    <StatsContainer tier={rankHistory.tier}>
      <StatItem>
        <RankInfo>
          <RankImage
            src={RankMap[rankHistory.tier].icon}
            alt={rankHistory.tier}
          />
          <RankText>
            {rankHistory.tier} {rankHistory.rank}
          </RankText>
        </RankInfo>
      </StatItem>
      <StatItem>
        <StateItemLabel>QUEUE</StateItemLabel>
        <StatItemText>
          {queueTypeMap[rankHistory.queueType] || rankHistory.queueType}
        </StatItemText>
      </StatItem>
      <StatItem>
        <StateItemLabel>GAMES</StateItemLabel>
        <StatItemText>{rankHistory.wins + rankHistory.losses}</StatItemText>
      </StatItem>
      <StatItem>
        <StateItemLabel>WINRATE</StateItemLabel>
        <StatItemText>{winRate}%</StatItemText>
      </StatItem>
      <StatItem>
        <StateItemLabel>LP</StateItemLabel>
        <StatItemText>{rankHistory.leaguePoints}</StatItemText>
      </StatItem>
      <StatItem>
        <IconImage
          src={`https://ddragon.leagueoflegends.com/cdn/14.24.1/img/profileicon/${summonerInfo.profileIconId}.png`}
          alt={summonerInfo.profileIconId}
        />
      </StatItem>
    </StatsContainer>
  );
};
