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

export function getAccountInfo(apiKey: string, params: AccountInfoParams): Promise<any>;
export function getIsBanned(apiKey: string, params: GetIsBannedParams): Promise<any>;
export function getPlayerStats(apiKey: string, params: PlayerStatsParams): Promise<any>;
export function getSeasonalStats(apiKey: string, params: SeasonalStatsParams): Promise<any>;
export function getServiceStatus(apiKey: string): Promise<any>;
export function getGameStats(apiKey: string): Promise<GameStats>;
export function getMaps(apiKey: string, params?: GetMapsParams): Promise<any[]>;
export function getOperators(apiKey: string, params?: GetOperatorsParams): Promise<any[]>;
export function getSeasons(apiKey: string, params?: GetSeasonsParams): Promise<any[]>;
export function getAttachment(apiKey: string, params?: GetAttachmentParams): Promise<any[]>;
export function getCharms(apiKey: string, params?: GetCharmsParams): Promise<any[]>;
export function getWeapons(apiKey: string, params?: GetWeaponsParams): Promise<any[]>;
export function getUniversalSkins(apiKey: string, params?: GetUniversalSkinsParams): Promise<any[]>;
export function getRanks(apiKey: string, params?: GetRanksParams): Promise<any[]>;
export function getSearchAll(apiKey: string, query: string): Promise<SearchAllResult>;
export function createDiscordR6Webhook(webhookUrl: string, playerData: any, options: DiscordWebhookOptions): Promise<any>;
export function getPlayerComparisons(apiKey: string, params: PlayerComparisonsParams): Promise<PlayerComparisonsResult>;
