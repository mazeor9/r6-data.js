# r6-data.js — R6 Rainbow Six Siege API Wrapper

**Rainbow Six Siege (R6) API wrapper** - Get player stats, operators, maps, ranks, seasons, charms, and more. Full TypeScript support included. Last updated Y11S1.

<div align="center">
  <p>
    <a href="https://github.com/mazeor9/r6-data.js/releases/latest">
      <img src="https://img.shields.io/github/v/release/mazeor9/r6-data.js?style=for-the-badge" alt="GitHub release (latest SemVer)" />
    </a>
    <a href="https://github.com/mazeor9/r6-data.js/releases/latest">
      <img src="https://img.shields.io/github/release-date/mazeor9/r6-data.js?label=latest%20release&style=for-the-badge" alt="Latest release" />
    </a>
    <a href="https://www.npmjs.com/package/r6-data.js">
      <img src="https://img.shields.io/npm/v/r6-data.js.svg?logo=npm&style=for-the-badge" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/r6-data.js">
      <img src="https://img.shields.io/npm/dt/r6-data.js.svg?style=for-the-badge" alt="NPM downloads" />
    </a>
  </p>
</div>

## Installation

```sh
npm i r6-data.js
```

## Getting Started

> **Notice:** Due to the abuse of the available APIs, it is necessary to register on [r6data.eu](https://r6data.eu/) and create an API key to use this package.

## R6Data Website for stats and API

Website where you can directly track your stats and also check all the info that r6-data.js provides. The entire website is based on r6-data.js.

Visit the official website: **[r6data.eu](https://r6data.eu/)**

### 1. Initialization
The entire SDK is accessed through the `R6Client` instance.

```javascript
const { R6Client } = require('r6-data.js');

const r6 = new R6Client({ 
  apiKey: 'YOUR_API_KEY' // Required
});
```

### 2. TypeScript Support
The SDK provides complete TypeScript declarations!

```typescript
import { R6Client, AccountInfoParams } from 'r6-data.js';

const r6 = new R6Client({ apiKey: 'YOUR_API_KEY' });

const params: AccountInfoParams = {
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay'
};

const accountInfo = await r6.players.getAccountInfo(params);
```

---

## Players Resource (`r6.players`)

Methods to get account information and stats about specific players. 

### `getAccountInfo(params)`
Retrieves player profile data from the official Rainbow Six Siege API. This function is specifically designed for retrieving account information.

**Parameters:**
- `nameOnPlatform`: (Required) The player's name on the platform
- `platformType`: (Required) The platform type - "uplay", "psn", or "xbl"

**Response Include:**
- Player level and experience
- Clearance level
- Achievement status
- Play time statistics
- Player profile settings and customization

```javascript
const accountInfo = await r6.players.getAccountInfo({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay'
});
```

### `getIsBanned(params)`
Checks if a player is currently banned from Rainbow Six Siege. Returns data indicating the player's ban status.

```javascript
const banStatus = await r6.players.getIsBanned({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay'
});
```

### `getPlayerStats(params)`
Retrieves detailed gameplay statistics from the official Rainbow Six Siege API. This function is specifically designed for retrieving player performance data across different game modes.

**Parameters:**
- `nameOnPlatform`: (Required) The player's name on the platform
- `platformType`: (Required) The platform type - "uplay", "psn", or "xbl"
- `platform_families`: (Required) The platform family - "pc" or "console"
- `board_id`: (Optional) The game mode to filter statistics - "casual", "event", "warmup", "standard", or "ranked"

**Response Includes:**
- Rank information & MMR (Matchmaking Rating)
- Win/loss records & Seasonal performance data
- Skill metrics across different gameplay modes

```javascript
// Get player statistics for ranked mode only
const rankedStats = await r6.players.getPlayerStats({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay',
  platform_families: 'pc',
  board_id: 'ranked'
});
```

### `getPlayerComparisons(params)`
Compares Rainbow Six Siege statistics between multiple players, providing rankings and comparison metrics.

**Parameters:**
- `players`: (Required) Array of player objects with `nameOnPlatform` and `platformType`
- `platform_families`: (Required) "pc" or "console"
- `board_id`: (Optional) Game mode filter - "casual", "ranked", etc.
- `compareFields`: (Optional) Specific stats to compare (default: kills, deaths, wins, losses)

```javascript
const comparison = await r6.players.getPlayerComparisons({
  players: [
    { nameOnPlatform: 'Player1', platformType: 'uplay' },
    { nameOnPlatform: 'Player2', platformType: 'uplay' }
  ],
  platform_families: 'pc',
  board_id: 'ranked'
});
```

### `getSeasonalStats(params)`
Get detailed rank points history and seasonal progression for a specific player in the current season. Includes timestamp, rank information, RP values, and rank images.

**Example Request:**
```javascript
const seasonalStats = await r6.players.getSeasonalStats({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay'
});
```

**Example Response:**
```json
{
  "data": {
    "history": {
      "metadata": {
        "key": "RankPoints",
        "name": "Rank Points"
      },
      "data": [
        [
          "2025-10-14T21:43:27.315+00:00",
          {
            "displayName": "Rank Points",
            "metadata": {
              "rank": "PLATINUM II",
              "imageUrl": "https://r6data.eu/assets/img/r6_ranks_img/platinum-2.webp",
              "color": "#44ccc2"
            },
            "value": 3300,
            "displayValue": "3,300",
            "displayType": "Number"
          }
        ]
      ]
    }
  }
}
```

### `getOperatorStats(params)`
Get detailed operator statistics for a specific player.
- **Parameters:** `{ nameOnPlatform, platformType, seasonYear?, modes? }`
```javascript
const opStats = await r6.players.getOperatorStats({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay',
  seasonYear: 'Y9S4', // Optional
  modes: 'ranked'     // Optional, default is 'ranked'
});
```

---

## Game Resource (`r6.game`)

Methods related to game metrics, operators, seasons, maps, and specific game modes.

### `getGameStats()`
Real-time player count statistics across all platforms including Steam, Ubisoft Connect, PlayStation, Xbox, and total player counts.

**Example Request:**
```javascript
const gameStats = await r6.game.getGameStats();
```

**Example Response:**
```json
{
  "steam": {
    "concurrent": 33631,
    "estimate": 33631
  },
  "crossPlatform": {
    "totalRegistered": 85000000,
    "monthlyActive": 15300000,
    "trendsEstimate": 175666,
    "platforms": {
      "pc": 6885000,
      "playstation": 5355000,
      "xbox": 3060000
    }
  },
  "ubisoft": {
    "onlineEstimate": 127739
  },
  "lastUpdated": "2025-10-15T22:39:38.636Z"
}
```

### Metadata Methods (Filters)
Retrieve information about the maps, operators, seasons, weapons, and more. You can get a list of all entities or filter based on specific criteria.

**Examples:**
```javascript
// Get all maps
const maps = await r6.game.getMaps();

// Filter maps by specific parameters
const mapsByName = await r6.game.getMaps({ name: 'Bank' });
const mapsByLocation = await r6.game.getMaps({ location: 'USA' });
const mapsByRelease = await r6.game.getMaps({ releaseDate: '2015-12-01' });
const mapsByPlaylist = await r6.game.getMaps({ playlists: 'ranked' });
const mapsByRework = await r6.game.getMaps({ mapReworked: true });

// Filter Operators
const ash = await r6.game.getOperators({ name: 'Ash' });
const recruit = await r6.game.getOperators({ safename: 'recruit' });
const byRealName = await r6.game.getOperators({ realname: 'Eliza Cohen' });
const byBirthplace = await r6.game.getOperators({ birthplace: 'Jerusalem, Israel' });

// Filter Seasons
const blackIce = await r6.game.getSeasons({ name: 'Black Ice' });
const byMap = await r6.game.getSeasons({ map: 'Yacht' });
```

Available lookup methods:
- `getMaps(params?)`
- `getOperators(params?)`
- `getSeasons(params?)`
- `getWeapons(params?)`
- `getCharms(params?)`
- `getUniversalSkins(params?)`
- `getAttachment(params?)`

### `getRanks(params)`
Retrieve rank images, mmr boundaries, and data for different versions of Ranked systems.
- `v1`: Until Y1S3
- `v2`: Y1S4
- `v3`: Y2S1 - Y4S2
- `v4`: Y4S3 - Y6S2
- `v5`: Y6S3 - Y7S3
- `v6`: Y7S4+ (Ranked 2.0)
- `v7`: Y11S2+ (Ranked 3.0)

```javascript
const ranksV1 = await r6.game.getRanks({ version: 'v1' });
const filteredRanks = await r6.game.getRanks({ min_mmr: 2000, max_mmr: 2500, version: 'v1' });
```

### `getSearchAll(query)`
Search across **all** R6 entities simultaneously.

```javascript
const searchResults = await r6.game.getSearchAll('black ice');
console.log('Search results summary:', searchResults.summary);

// Access specific result categories
console.log('Operator results:', searchResults.results.operators);
console.log('Weapon results:', searchResults.results.weapons);
```

### `getServiceStatus()`
Retrieves the current status of the Rainbow Six Siege game servers.

**Example Request:**
```javascript
const status = await r6.game.getServiceStatus();
```

---

## 🔔 Webhooks Resource (`r6.webhooks`)

The `createDiscordR6Webhook()` function allows you to send Rainbow Six Siege player statistics directly to a Discord channel in beautifully formatted dynamic embeds. It automatically detects and formats data from `Ubisoft API` and `Steam`.

```javascript
// First, get player statistics
const playerStats = await r6.players.getPlayerStats({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay',
  platform_families: 'pc'
});

// Send stats directly to Discord webhook
const webhookResult = await r6.webhooks.createDiscordR6Webhook(
  'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
  playerStats, 
  {
    playerName: 'PlayerName',
    title: 'Rainbow Six Siege Stats',
    message: 'Here are the latest R6 stats!',
    color: 0xF99E1A,
    avatarUrl: 'https://example.com/avatar.png'
  }
);
```

## Error Handling

The package functions throw an exception if an error occurs during API requests. Make sure to handle errors appropriately using try-catch blocks.

## License
This package is fan made, so it has been created for only informational purposes.