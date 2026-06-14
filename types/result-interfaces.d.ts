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

export interface PlayerComparisonsResult {
  players: Array<{
    player: {
      nameOnPlatform: string;
      platformType: PlatformType;
    };
    stats: any;
    success: boolean;
    error?: string;
  }>;
  comparison_summary: {
    field_comparisons: Record<string, {
      rankings: Array<{
        player: string;
        value: number;
        platform: PlatformType;
      }>;
      highest: {
        player: string;
        value: number;
        platform: PlatformType;
      };
      lowest: {
        player: string;
        value: number;
        platform: PlatformType;
      };
      average: number;
    }>;
    rankings: Record<string, any>;
  };
  metadata: {
    total_players: number;
    successful_fetches: number;
    failed_fetches: number;
    platform_families: PlatformFamily;
    board_id: string;
    timestamp: string;
  };
  errors?: Array<{
    player: {
      nameOnPlatform: string;
      platformType: PlatformType;
    };
    error: string;
  }>;
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