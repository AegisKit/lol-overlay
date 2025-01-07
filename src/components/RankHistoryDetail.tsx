import { IMatch } from "../interfaces/IMatch";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 160px;
  padding-top: 0;
`;

const MatchesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 4px;
  max-width: 640px;
  width: 100%;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
`;

const MatchCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  width: 72px;
  height: 110px;
  justify-content: space-between;

  h5 {
    margin: 2px 0;
    font-size: 13px;
  }
`;

interface KDATextProps {
  kda: number;
}

const KDAText = styled.h5<KDATextProps>`
  margin: 2px 0;
  font-size: 13px;
  color: ${(props) => (props.kda >= 3.0 ? "#FFD700" : "inherit")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-family: "Beaufort for LOL", sans-serif;
`;

interface MatchCardProps {
  win: boolean;
}

const StyledMatchCard = styled(MatchCard)<MatchCardProps>`
  img {
    width: 40px;
    height: 40px;
    border: 2px solid ${(props) => (props.win ? "#4CAF50" : "#f44336")};
    border-radius: 50%;
  }
`;

interface RankHistoryProps {
  matches: IMatch[] | null;
}

export const RankHistoryDetail = ({ matches }: RankHistoryProps) => {
  if (!matches) return null;

  const calculateKDA = (kills: number, deaths: number, assists: number) => {
    const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;
    return kda.toFixed(2);
  };

  return (
    <>
      <Container>
        <MatchesContainer>
          {matches.map((match, index) => {
            const kda = Number(
              calculateKDA(match.kills, match.deaths, match.assists)
            );

            return (
              <StyledMatchCard key={index} win={match.win}>
                <h5>
                  {match.kills}/{match.deaths}/{match.assists}
                </h5>
                <img src={match.championIconUrl} alt={match.championName} />
                <KDAText kda={kda}>
                  <span>KDA</span>
                  <span>{kda}</span>
                </KDAText>
              </StyledMatchCard>
            );
          })}
        </MatchesContainer>
      </Container>
    </>
  );
};
