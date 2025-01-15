import { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { RankHistoryDetail } from "./components/RankHistoryDetail";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { api } from "./api/api";
import { IMatch } from "./interfaces/IMatch";
import { RankHistory } from "./components/RankHistory";
import { RankChart } from "./components/RankChart";
import { LiveGame } from "./components/LiveGame";
import styled from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }
`;

const SummonerPage = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
`;

const PageContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.isVisible ? "1" : "0")};
  transition: opacity 1s ease-in-out;
  pointer-events: ${(props) => (props.isVisible ? "auto" : "none")};
  z-index: ${(props) => (props.isVisible ? "1" : "0")};
`;

const SummonerPageComponent = () => {
  const { gameName, tagLine } = useParams();
  const [matchDetails, setMatchDetails] = useState<IMatch[] | null>(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [matchIds, setMatchIds] = useState<string[] | null>(null);
  const [summonerInfo, setSummonerInfo] = useState<any>(null);
  const [summonerDetail, setSummonerDetail] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [lpHistories, setLpHistories] = useState([]);
  const [liveGame, setLiveGame] = useState<any | null>(null);
  let pages: any[] = [];

  const fetchData = async () => {
    if (gameName && tagLine) {
      const opggBuildId = await api.getOpggBuildId(gameName, tagLine);
      const opggSummonerInfo = await api.getOpggSummonerInfo(
        gameName,
        tagLine,
        opggBuildId
      );
      const lpHistoriesJson = await api.getLpHistoriesWeek(
        opggSummonerInfo.pageProps.data.summoner_id
      );
      if (lpHistoriesJson) {
        setLpHistories(lpHistoriesJson.data);
      }
      const decodedGameName = decodeURIComponent(gameName);
      const decodedTagLine = decodeURIComponent(tagLine);

      const accountInfoJson = await api.getAccountInfo(
        decodedGameName,
        decodedTagLine
      );
      setAccountInfo(accountInfoJson);
      const summonerInfo = await api.getSummonerId(accountInfoJson.puuid);
      setSummonerInfo(summonerInfo);
      const summonerDetailsJson = await api.getSummonerDetails(summonerInfo.id);
      setSummonerDetail(
        summonerDetailsJson.find(
          (detail) => detail.queueType === "RANKED_SOLO_5x5"
        )
      );
      const matchIdsJson = await api.getMatchIds(accountInfoJson.puuid);
      setMatchIds(matchIdsJson.reverse());
      const matchDetails = await Promise.all(
        matchIdsJson.map((id) => api.getMatch(id, accountInfoJson.puuid))
      );
      setMatchDetails(
        matchDetails.filter((match): match is IMatch => match !== null)
      );
      const liveGameJson = await api.getLiveGame(accountInfoJson.puuid);
      if (liveGameJson.status?.status_code !== 404) {
        setLiveGame(liveGameJson);
      } else {
        setLiveGame(null);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const fetchInterval = setInterval(fetchData, 60000);

    return () => clearInterval(fetchInterval);
  }, [gameName, tagLine]);

  pages = [
    ...(matchDetails !== null
      ? [<RankHistoryDetail matches={matchDetails} />]
      : []),
    ...(summonerDetail !== undefined && summonerInfo !== undefined
      ? [
          <RankHistory
            rankHistory={summonerDetail}
            summonerInfo={summonerInfo}
          />,
        ]
      : []),
    ...(lpHistories.length > 0
      ? [<RankChart lpHistories={lpHistories} />]
      : []),
    ...(liveGame !== null
      ? [<LiveGame gameInfo={liveGame} summonerId={summonerInfo.id} />]
      : []),
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [pages.length, currentPage]);

  return (
    <SummonerPage>
      {pages.map((page, index) => (
        <PageContainer key={index} isVisible={index === currentPage}>
          {page}
        </PageContainer>
      ))}
    </SummonerPage>
  );
};

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route
            path="/:gameName/:tagLine"
            element={<SummonerPageComponent />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
