// TypeScript declarations for r6-data.js (module-style, no ambient wrapper)

// ----- Types -----
export type PlatformType = "uplay" | "psn" | "xbl";
export type PlatformFamily = "pc" | "console";
export type BoardId = "casual" | "event" | "warmup" | "standard" | "ranked";
export type RankVersion = "v1" | "v2" | "v3" | "v4" | "v5" | "v6";

export interface AccountInfoParams {
  nameOnPlatform: string;
  platformType: PlatformType;
}
export interface PlayerStatsParams extends AccountInfoParams {
  platform_families: PlatformFamily;
  board_id?: BoardId;
}
export interface SeasonalStatsParams extends AccountInfoParams {}

export interface GetMapsParams {
  name?: string; location?: string; releaseDate?: string; playlists?: string; mapReworked?: boolean;
}
export interface GetOperatorsParams {
  name?: string; safename?: string; realname?: string; birthplace?: string; age?: number; date_of_birth?: string; season_introduced?: string;
}
export interface GetSeasonsParams {
  name?: string; map?: string; operators?: string; weapons?: string;
}
export interface GetAttachmentParams {
  name?: string; style?: string; rarity?: string; availability?: string;
}
export interface GetCharmsParams {
  name?: string; collection?: string; rarity?: string; availability?: string; bundle?: string; season?: string;
}
export interface GetWeaponsParams { name?: string; }
export interface GetUniversalSkinsParams { name?: string; }
export interface GetRanksParams { version?: RankVersion; min_mmr?: number; max_mmr?: number; }

export interface SearchAllResult {
  query: string;
  summary: Record<string, number>;
  results: {
    operators: any[]; weapons: any[]; maps: any[]; seasons: any[]; charms: any[]; attachments: any[];
    [k: string]: any;
  };
}
export interface GameStats {
  steam?: { concurrent?: number; estimate?: number };
  crossPlatform?: { totalRegistered?: number; monthlyActive?: number; trendsEstimate?: number; platforms?: { pc?: number; playstation?: number; xbox?: number } };
  ubisoft?: { onlineEstimate?: number };
  lastUpdated?: string;
  [k: string]: any;
}
export interface DiscordWebhookOptions {
  playerName: string; title?: string; message?: string; color?: number; avatarUrl?: string;
}

// ----- Functions -----
export function getAccountInfo(params: AccountInfoParams): Promise<any>;
export function getPlayerStats(params: PlayerStatsParams): Promise<any>;
export function getSeasonalStats(params: SeasonalStatsParams): Promise<any>;
export function getServiceStatus(): Promise<any>;
export function getGameStats(): Promise<GameStats>;
export function getMaps(params?: GetMapsParams): Promise<any[]>;
export function getOperators(params?: GetOperatorsParams): Promise<any[]>;
export function getSeasons(params?: GetSeasonsParams): Promise<any[]>;
export function getAttachment(params?: GetAttachmentParams): Promise<any[]>;
export function getCharms(params?: GetCharmsParams): Promise<any[]>;
export function getWeapons(params?: GetWeaponsParams): Promise<any[]>;
export function getUniversalSkins(params?: GetUniversalSkinsParams): Promise<any[]>;
export function getRanks(params?: GetRanksParams): Promise<any[]>;
export function getSearchAll(query: string): Promise<SearchAllResult>;
export function createDiscordR6Webhook(webhookUrl: string, playerData: any, options: DiscordWebhookOptions): Promise<any>;

// ----- Default export -----
declare const r6Data: {
  getAccountInfo: typeof getAccountInfo;
  getPlayerStats: typeof getPlayerStats;
  getSeasonalStats: typeof getSeasonalStats;
  getServiceStatus: typeof getServiceStatus;
  getGameStats: typeof getGameStats;
  getMaps: typeof getMaps;
  getOperators: typeof getOperators;
  getSeasons: typeof getSeasons;
  getAttachment: typeof getAttachment;
  getCharms: typeof getCharms;
  getWeapons: typeof getWeapons;
  getUniversalSkins: typeof getUniversalSkins;
  getRanks: typeof getRanks;
  getSearchAll: typeof getSearchAll;
  createDiscordR6Webhook: typeof createDiscordR6Webhook;
};
export default r6Data;