import { IMatch } from "../interfaces/IMatch";
class Api {
  private riotApiKey: string;

  constructor() {
    this.riotApiKey = import.meta.env.VITE_RIOT_API_KEY;
  }

  public async getAccountInfo(gameName: string, tagLine: string) {
    const response = await fetch(
      `/asia/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getMatchIds(puuid: string) {
    const response = await fetch(
      `/asia/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getMatch(matchId: string, puuid: string) {
    const response = await fetch(
      `/asia/lol/match/v5/matches/${matchId}?api_key=${this.riotApiKey}`
    );
    const matchData = await response.json();
    return this.formatMatch(matchData, puuid);
  }

  public async getSummonerId(puuid: string) {
    const response = await fetch(
      `/jp1/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getSummonerDetails(summonerId: string) {
    const response = await fetch(
      `/jp1/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${this.riotApiKey}`
    );
    return response.json();
  }

  public async getLpHistoriesWeek(summonerName: string, tagLine: string) {
    const response = await fetch(
      `/opgg/_next/data/IBYkm0UpdSJC8o2eaIlAL/en_US/summoners/jp/${summonerName}-${tagLine}.json?region=jp&summoner=${summonerName}-${tagLine}`
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
