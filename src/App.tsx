import { useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";
import { RankHistoryDetail } from "./components/RankHistoryDetail";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { api } from "./api/api";
import { IMatch } from "./interfaces/IMatch";
import { RankHistory } from "./components/RankHistory";
import { RankChart } from "./components/RankChart";
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
  const [summonerInfo, setSummonerInfo] = useState<any[]>([]);
  const [summonerDetail, setSummonerDetail] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [lpHistories, setLpHistories] = useState([]);
  let pages: any[] = [];

  const fetchData = async () => {
    if (gameName && tagLine) {
      const opggData = await api.getLpHistoriesWeek(gameName, tagLine);
      setLpHistories(opggData.pageProps.data.lp_histories);
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
    ...(summonerDetail !== null
      ? [
          <RankHistory
            rankHistory={summonerDetail}
            summonerInfo={summonerInfo}
          />,
        ]
      : []),
    ...(lpHistories !== undefined
      ? [<RankChart lpHistories={lpHistories} />]
      : []),
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % pages.length);
    }, 5000);

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