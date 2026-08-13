// Result interfaces for r6-data.js

import { PlatformType, PlatformFamily } from './base-types';

export interface SearchAllResult {
  query: string;
  summary: Record<string, number>;
  results: {
    operators: any[];
    weapons: any[];
    maps: any[];
    seasons: any[];
    charms: any[];
    attachments: any[];
    [k: string]: any;
  };
}

export interface GameStats {
  steam?: {
    concurrent?: number;
    estimate?: number;
  };
  crossPlatform?: {
    totalRegistered?: number;
    monthlyActive?: number;
    trendsEstimate?: number;
    platforms?: {
      pc?: number;
      playstation?: number;
      xbox?: number;
    };
  };
  ubisoft?: {
    onlineEstimate?: number;
  };
  lastUpdated?: string;
  [k: string]: any;
}

export interface TwitchStats {
  liveViewers: { current: number; peak: number };
  channels: { live: number; total: number };
  watchTime: { last7Days: number; last30Days: number };
  category: { followers: number; rank: number; newFollowers30Days: number };
  lastUpdated: string;
}

export interface PlayerAccount {
  level: number;
  xp: number;
  profilePicture: string | null;
  profile: { level: number; xp: number };
  profiles: Array<{ platformType: PlatformType; nameOnPlatform: string }>;
}

export interface PlayerBoardProfile {
  season_id: number;
  profile: {
    rank: number;
    rank_points: number;
    max_rank: number;
    max_rank_points: number;
    kills: number;
    deaths: number;
    wins: number;
    losses: number;
    abandon: number;
    update_time: string;
  };
  season_statistics: {
    kills: number;
    deaths: number;
    match_outcomes: { wins: number; losses: number; abandons: number };
  };
}

export interface PlayerStats {
  platform_families_full_profiles: Array<{
    profile_id: string;
    board_ids_full_profiles: Array<{
      board_id: string;
      full_profiles: PlayerBoardProfile[];
    }>;
  }>;
}

export interface PlayerBanStatus {
  username: string;
  platform: PlatformType;
  isBanned: boolean;
  banAlerts: Array<{
    reasonName?: string;
    banDate?: string;
    banReversed: boolean;
  }>;
}

export interface PlayerProfileResponse {
  player: {
    nameOnPlatform: string;
    platformType: PlatformType;
    platformFamilies: PlatformFamily;
  };
  stats: PlayerStats;
  account: PlayerAccount | null;
  banned: PlayerBanStatus | null;
  seasons: Record<string, any> | null;
  history: Record<string, any> | null;
  meta: {
    included: string[];
    partial: boolean;
    errors: Record<string, string>;
  };
}

export interface OperatorStatsEntry {
  operator: string;
  side: string | null;
  roundsPlayed: number;
  winPercent: number | null;
  kd: number | null;
  headshotPercent: number | null;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  assists: number;
  aces: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  matchWinPercent: number | null;
  headshots: number;
  firstBloods: number;
  firstDeaths: number;
  teamKills: number;
  killsPerRound: number | null;
  deathsPerRound: number | null;
  assistsPerRound: number | null;
  headshotsPerRound: number | null;
  killsPerGame: number | null;
  timePlayed: string | null;
  timePlayedMs: number;
  clutches: number;
  clutchesLost: number;
  kills1K: number;
  kills2K: number;
  kills3K: number;
  kills4K: number;
  kills5K: number;
}

export interface OperatorStatsResponse {
  player: { nameOnPlatform: string; platformType: PlatformType };
  filters: { seasonYear: string; modes: string };
  operators: {
    seasonYear: string;
    seasonNumber: number | null;
    platformType: PlatformType;
    sessionType: string;
    operators: OperatorStatsEntry[];
  };
}

export interface LeaderboardEntry {
  id: string;
  kd: number | null;
  matchesPlayed: number | null;
  rankPoints: number;
  position: number;
}

export interface LeaderboardResponse {
  platform: PlatformFamily;
  page: number;
  entries: LeaderboardEntry[];
}

export interface ReplayMatchSummary {
  match_id: string;
  replay_match_id: string;
  title: string;
  map: string;
  mode: string;
  match_type: string;
  started_at_utc: string | null;
  uploaded_at_utc: string | null;
  updated_at_utc: string | null;
  rounds_count: number;
  blue_score: number;
  orange_score: number;
  total_kills: number;
  players_count: number;
}

export interface ReplayQuota {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
}

export interface MatchReplayResult {
  match: ReplayMatchSummary;
  matchID: string;
  rounds: any[];
}

export interface UploadReplaysResult {
  matchID: string;
  rounds: any[];
  match: ReplayMatchSummary;
  quota: ReplayQuota;
}
