import { IMatch } from "../interfaces/IMatch";
class Api {
  private riotApiKey: string;
  private asiaApiUrl: string;
  private jp1ApiUrl: string;
  private opggApiUrl: string;

  constructor() {
    this.riotApiKey = import.meta.env.VITE_RIOT_API_KEY;
    this.asiaApiUrl = import.meta.env.VITE_ASIA_API_URL;
    this.jp1ApiUrl = import.meta.env.VITE_JP1_API_URL;
    this.opggApiUrl = import.meta.env.VITE_OPGG_API_URL;
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

  public async getLpHistoriesWeek(summonerName: string, tagLine: string) {
    try {
      const response = await fetch(
        `${this.opggApiUrl}/_next/data/IBYkm0UpdSJC8o2eaIlAL/en_US/summoners/jp/${summonerName}-${tagLine}.json?region=jp`
      );

      if (!response.ok) {
        // HTTPエラーの場合はnullを返す
        return null;
      }

      return await response.json();
    } catch (error) {
      // JSONのパースエラーやネットワークエラーの場合はnullを返す
      console.error("Error fetching LP histories:", error);
      return null;
    }
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
