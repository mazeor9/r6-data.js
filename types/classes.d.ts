import {
  ProfileParams,
  OperatorStatsParams,
  LeaderboardParams,
  GetMapsParams,
  GetOperatorsParams,
  GetSeasonsParams,
  GetAttachmentParams,
  GetCharmsParams,
  GetWeaponsParams,
  GetUniversalSkinsParams,
  GetRanksParams,
  DiscordWebhookOptions,
  ReplayFileInput
} from './params-interfaces';

import {
  SearchAllResult,
  GameStats,
  TwitchStats,
  PlayerProfileResponse,
  OperatorStatsResponse,
  LeaderboardResponse,
  MatchReplayResult,
  UploadReplaysResult
} from './result-interfaces';

export class Players {
  getProfile(params: ProfileParams): Promise<PlayerProfileResponse>;
  getOperatorStats(params: OperatorStatsParams): Promise<OperatorStatsResponse>;
  getLeaderboard(params?: LeaderboardParams): Promise<LeaderboardResponse>;
}

export class Game {
  getServiceStatus(): Promise<any>;
  getGameStats(): Promise<GameStats>;
  getTwitchStats(): Promise<TwitchStats>;
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

export class MatchReplay {
  getMatch(matchId: string): Promise<MatchReplayResult>;
  uploadReplays(files: ReplayFileInput | ReplayFileInput[]): Promise<UploadReplaysResult>;
}

export class R6Client {
  constructor(config: { apiKey: string; baseUrl?: string; siteBaseUrl?: string });
  players: Players;
  game: Game;
  webhooks: Webhooks;
  matchReplay: MatchReplay;
}
