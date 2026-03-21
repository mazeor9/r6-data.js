import {
  AccountInfoParams,
  GetIsBannedParams,
  PlayerStatsParams,
  SeasonalStatsParams,
  OperatorStatsParams,
  PlayerComparisonsParams,
  GetMapsParams,
  GetOperatorsParams,
  GetSeasonsParams,
  GetAttachmentParams,
  GetCharmsParams,
  GetWeaponsParams,
  GetUniversalSkinsParams,
  GetRanksParams,
  DiscordWebhookOptions
} from './params-interfaces';

import {
  SearchAllResult,
  GameStats,
  PlayerComparisonsResult
} from './result-interfaces';

export class Players {
  getAccountInfo(params?: AccountInfoParams): Promise<any>;
  getIsBanned(params?: GetIsBannedParams): Promise<any>;
  getPlayerStats(params?: PlayerStatsParams): Promise<any>;
  getStats(params?: any): Promise<any>;
  getSeasonalStats(params?: SeasonalStatsParams): Promise<any>;
  getOperatorStats(params?: OperatorStatsParams): Promise<any>;
  getPlayerComparisons(params?: PlayerComparisonsParams): Promise<PlayerComparisonsResult>;
}

export class Game {
  getServiceStatus(): Promise<any>;
  getGameStats(): Promise<GameStats>;
  getMaps(params?: GetMapsParams): Promise<any[]>;
  getOperators(params?: GetOperatorsParams): Promise<any[]>;
  getSeasons(params?: GetSeasonsParams): Promise<any[]>;
  getAttachment(params?: GetAttachmentParams): Promise<any[]>;
  getCharms(params?: GetCharmsParams): Promise<any[]>;
  getWeapons(params?: GetWeaponsParams): Promise<any[]>;
  getUniversalSkins(params?: GetUniversalSkinsParams): Promise<any[]>;
  getRanks(params?: GetRanksParams): Promise<any[]>;
  getSearchAll(query: string): Promise<SearchAllResult>;
}

export class Webhooks {
  createDiscordR6Webhook(webhookUrl: string, playerData: any, options: DiscordWebhookOptions): Promise<any>;
}

export class R6Client {
  constructor(config: { apiKey: string });
  players: Players;
  game: Game;
  webhooks: Webhooks;
}
