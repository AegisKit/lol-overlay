import { IMatch } from "../interfaces/IMatch";

class Api {
  private riotApiKey: string;
  private asiaApiUrl: string;
  private jp1ApiUrl: string;
  private opggApiUrl: string;
  private opggWebUrl: string;

  constructor() {
    this.riotApiKey = import.meta.env.VITE_RIOT_API_KEY;
    this.asiaApiUrl = import.meta.env.VITE_ASIA_API_URL;
    this.jp1ApiUrl = import.meta.env.VITE_JP1_API_URL;
    this.opggApiUrl = import.meta.env.VITE_OPGG_API_URL;
    this.opggWebUrl = import.meta.env.VITE_OPGG_WEB_URL;
  }

  public async getAccountInfo(gameName: string, tagLine: string) {
    const response = await fetch(
      `${this.asiaApiUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getMatchIds(puuid: string) {
    const response = await fetch(
      `${this.asiaApiUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getMatch(matchId: string, puuid: string) {
    const response = await fetch(
      `${this.asiaApiUrl}/lol/match/v5/matches/${matchId}?api_key=${this.riotApiKey}`
    );
    const matchData = await response.json();
    return this.formatMatch(matchData, puuid);
  }

  public async getSummonerId(puuid: string) {
    const response = await fetch(
      `${this.jp1ApiUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getSummonerDetails(summonerId: string) {
    const response = await fetch(
      `${this.jp1ApiUrl}/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getOpggSummonerInfo(
    summonerName: string,
    tagLine: string,
    buildId: string
  ) {
    const response = await fetch(
      `${this.opggWebUrl}/_next/data/${buildId}/en_US/summoners/jp/${summonerName}-${tagLine}.json?region=jp&summoner=${summonerName}-${tagLine}`
    );
    return response.json();
  }

  public async getOpggBuildId(summonerName: string, tagLine: string) {
    try {
      const response = await fetch(
        `${this.opggWebUrl}/summoners/jp/${summonerName}-${tagLine}`
      );

      if (!response.ok) {
        console.error("Failed to fetch page:", response.statusText);
        return null;
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const scriptsArray = Array.from(doc.scripts);

      const nextDataScript = scriptsArray.find((script) =>
        script.innerText?.includes("buildId")
      );

      if (nextDataScript && nextDataScript.textContent) {
        try {
          // 文字列操作でbuildIdを抽出
          const content = nextDataScript.textContent;
          const buildIdIndex = content.indexOf("buildId");
          if (buildIdIndex !== -1) {
            const start = content.indexOf(":", buildIdIndex) + 1;
            const end = content.indexOf('"', start + 2);
            const buildId = content
              .substring(start, end)
              .trim()
              .replace(/"/g, "")
              .replace(/\\/g, "");
            return buildId;
          }
        } catch (error) {
          console.error("Failed to extract buildId:", error);
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching or parsing data:", error);
      return null;
    }
  }

  public async getLiveGame(puuid: string) {
    const response = await fetch(
      `${this.jp1ApiUrl}/lol/spectator/v5/active-games/by-summoner/${puuid}?api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  private formatMatch(match: any, puuid: string): IMatch | null {
    for (const participant of match.info.participants) {
      if (participant.puuid === puuid) {
        return {
          kills: participant.kills,
          deaths: participant.deaths,
          assists: participant.assists,
          championName: participant.championName,
          championIconUrl: this.getChampionIconUrl(participant.championName),
          win: participant.win,
        };
      }
    }
    return null;
  }

  private getChampionIconUrl(championName: string) {
    return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${championName}.png`;
  }
}

export const api = new Api();
