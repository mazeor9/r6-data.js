// TypeScript declarations for r6-data.js (module-style, no ambient wrapper)

// Re-export all types and interfaces from modular files
export * from './types';

// ----- Default export -----
import {
  getAccountInfo,
  getPlayerStats,
  getSeasonalStats,
  getServiceStatus,
  getGameStats,
  getMaps,
  getOperators,
  getSeasons,
  getAttachment,
  getCharms,
  getWeapons,
  getUniversalSkins,
  getRanks,
  getSearchAll,
  createDiscordR6Webhook,
  getPlayerComparisons
} from './types/function-declarations';

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
  getPlayerComparisons: typeof getPlayerComparisons;
};
export default r6Data;