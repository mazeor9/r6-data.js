// Parameter interfaces for r6-data.js

import { PlatformType, PlatformFamily, BoardId, RankVersion } from './base-types';

export interface AccountInfoParams {
  nameOnPlatform: string;
  platformType: PlatformType;
}

export interface GetIsBannedParams extends AccountInfoParams {}

export interface PlayerStatsParams extends AccountInfoParams {
  platform_families: PlatformFamily;
  board_id?: BoardId;
}

export interface SeasonalStatsParams extends AccountInfoParams {}

export interface PlayerComparisonsParams {
  players: Array<{
    nameOnPlatform: string;
    platformType: PlatformType;
  }>;
  platform_families: PlatformFamily;
  board_id?: BoardId;
  compareFields?: string[];
}

export interface GetMapsParams {
  name?: string;
  location?: string;
  releaseDate?: string;
  playlists?: string;
  mapReworked?: boolean;
}

export interface GetOperatorsParams {
  name?: string;
  safename?: string;
  realname?: string;
  birthplace?: string;
  age?: number;
  date_of_birth?: string;
  season_introduced?: string;
}

export interface GetSeasonsParams {
  name?: string;
  map?: string;
  operators?: string;
  weapons?: string;
}

export interface GetAttachmentParams {
  name?: string;
  style?: string;
  rarity?: string;
  availability?: string;
}

export interface GetCharmsParams {
  name?: string;
  collection?: string;
  rarity?: string;
  availability?: string;
  bundle?: string;
  season?: string;
}

export interface GetWeaponsParams {
  name?: string;
}

export interface GetUniversalSkinsParams {
  name?: string;
}

export interface GetRanksParams {
  version?: RankVersion;
  min_mmr?: number;
  max_mmr?: number;
}

export interface DiscordWebhookOptions {
  playerName: string;
  title?: string;
  message?: string;
  color?: number;
  avatarUrl?: string;
}