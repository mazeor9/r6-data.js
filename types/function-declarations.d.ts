// Function declarations for r6-data.js

import {
  AccountInfoParams,
  GetIsBannedParams,
  PlayerStatsParams,
  SeasonalStatsParams,
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

export function getAccountInfo(params: AccountInfoParams): Promise<any>;
export function getIsBanned(params: GetIsBannedParams): Promise<any>;
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
export function getPlayerComparisons(params: PlayerComparisonsParams): Promise<PlayerComparisonsResult>;