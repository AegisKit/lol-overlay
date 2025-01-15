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

  public async getLpHistoriesWeek(opggId: string) {
    try {
      const response = await fetch(
        `${this.opggApiUrl}/api/v1.0/internal/bypass/summoners/jp/${opggId}/lp-histories?lp_history_type=WEEK`
      );

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching LP histories:", error);
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
          championIconUrl: this.getChampionIconUrlFromName(
            participant.championName
          ),
          win: participant.win,
        };
      }
    }
    return null;
  }

  private getChampionIconUrlFromName(championName: string) {
    return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/${championName}.png`;
  }

  public async getChampionIconUrlFromId(championId: string) {
    const championsJson = await fetch(
      "https://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US/champion.json"
    );
    const champions = await championsJson.json();
    const championData = Object.values(champions)[3];
    const champion = Object.values(championData).find(
      (data: any) => data.key == championId
    ) as { id: string } | undefined;

    const championName = champion?.id;

    return this.getChampionIconUrlFromName(championName);
  }

  public async getRuneIcons(runes) {
    const runeJson = await fetch(
      "http://ddragon.leagueoflegends.com/cdn/15.1.1/data/en_US/runesReforged.json"
    );
    const runeData = await runeJson.json();
    const mainRune = Object.values(runeData).find(
      (data: any) => data.id == runes.perkStyle
    ) as
      | { icon: string; slots: { runes: { id: string; icon: string }[] }[] }
      | undefined;
    const mainAllRunes = mainRune.slots.flatMap((slot) => slot.runes);
    const mainRuneIds = runes.perkIds.slice(0, 3);
    const mainRunes = mainAllRunes.filter((rune) =>
      mainRuneIds.includes(rune.id)
    );

    const subRune = Object.values(runeData).find(
      (data: any) => data.id == runes.perkSubStyle
    ) as
      | { icon: string; slots: { runes: { id: string; icon: string }[] }[] }
      | undefined;
    const subAllRunes = subRune.slots.flatMap((slot) => slot.runes);
    const subRuneIds = runes.perkIds.slice(3, 6);
    const subRunes = subAllRunes.filter((rune) => subRuneIds.includes(rune.id));

    const StatModMap = {
      5011: "/images/StatMods/healthplusicon.png",
      5008: "/images/StatMods/aptiveforceicon.png",
      5001: "/images/StatMods/healthscalingicon.png",
      5007: "/images/StatMods/cdrscalingicon.png",
      5005: "/images/StatMods/attackspeedicon.png",
      5013: "/images/StatMods/stenacityicon.png",
      5010: "/images/StatMods/movementspeedicon.png",
    };

    const shards = runes.perkIds.slice(6, 9);
    const shardIcons = shards.map((shard) => StatModMap[shard]);
    return {
      mainRune: {
        icon: `https://ddragon.leagueoflegends.com/cdn/img/${mainRune?.icon}`,
        runes: mainRunes.map(
          (rune) => `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`
        ),
      },
      subRune: {
        icon: `https://ddragon.leagueoflegends.com/cdn/img/${subRune?.icon}`,
        runes: subRunes.map(
          (rune) => `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`
        ),
      },
      shards: shardIcons,
    };
  }
}

export const api = new Api();
