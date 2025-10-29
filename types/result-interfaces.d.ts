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