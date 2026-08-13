# r6-data.js — R6 Rainbow Six Siege API Wrapper

**Rainbow Six Siege (R6) API sdk** - Get player stats, operators, maps, ranks, seasons, charms, and more. Full TypeScript support included. Last updated Y11S2 - Ranked 3.0.

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

> **Notice:** Due to the abuse of the available APIs, it is necessary to register on [r6.arenyze.com](https://r6.arenyze.com/) and create an API key to use this package.

## R6 Website for stats and API

Website where you can directly track your stats and also check all the info that r6-data.js provides. The entire website is based on r6-data.js.

Visit the official website: **[r6.arenyze.com](https://r6.arenyze.com/)**

### 1. Initialization
The entire SDK is accessed through the `R6Client` instance.

```javascript
const { R6Client } = require('r6-data.js');

const r6 = new R6Client({ 
  apiKey: 'YOUR_API_KEY' // Required
});
```

By default the SDK talks to two hosts:

| Host | Used for |
|---|---|
| `https://public-api.arenyze.com/r6/api` | every stats and catalogue endpoint |
| `https://r6.arenyze.com/api` | the match replay endpoints |

Both accept the same API key. Either one can be pointed somewhere else — a
staging deployment, a local instance — without changing anything else:

```javascript
const r6 = new R6Client({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'http://localhost:3002/r6/api',   // optional
  siteBaseUrl: 'http://localhost:5000/api',  // optional, replay routes
});
```

### 2. TypeScript Support
The SDK provides complete TypeScript declarations!

```typescript
import { R6Client, ProfileParams, PlayerProfileResponse } from 'r6-data.js';

const r6 = new R6Client({ apiKey: 'YOUR_API_KEY' });

const params: ProfileParams = {
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay',
  platform_families: 'pc'
};

const profile: PlayerProfileResponse = await r6.players.getProfile(params);
```

---

## Players Resource (`r6.players`)

Player Data V2 uses one profile request for account information, statistics, ban status, seasons, and rank history.

> **Migration to 3.3.0:** `getAccountInfo`, `getIsBanned`, `getPlayerStats`, `getStats`, `getSeasonalStats`, and `getPlayerComparisons` were replaced by `getProfile`. Operator statistics and leaderboards remain dedicated requests.

### `getProfile(params)`

Calls `GET /r6/api/v2/profile`.

**Parameters:**

- `nameOnPlatform` (required): player username.
- `platformType` (required): `uplay`, `psn`, or `xbl`.
- `platform_families` (optional): `pc`, `psn`, or `xbl`; inferred from `platformType` when omitted.

```javascript
const profile = await r6.players.getProfile({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay',
  platform_families: 'pc'
});

console.log(profile.account);
console.log(profile.stats);
console.log(profile.banned);
console.log(profile.seasons);
console.log(profile.history);
console.log(profile.meta);
```

The response has this top-level shape:

```jsonc
{
  "player": {
    "nameOnPlatform": "PlayerName",
    "platformType": "uplay",
    "platformFamilies": "pc"
  },
  "stats": {
    "platform_families_full_profiles": []
  },
  "account": {
    "level": 250,
    "xp": 0,
    "profilePicture": "https://avatars.ubisoft.com/..."
  },
  "banned": {
    "isBanned": false,
    "banAlerts": []
  },
  "seasons": {},
  "history": {},
  "meta": {
    "included": ["stats", "account", "banned", "seasons", "history"],
    "partial": false,
    "errors": {}
  }
}
```

Only `stats` is mandatory upstream. If an optional block is unavailable it is `null`, while `meta.partial` and `meta.errors` describe the missing data.

### `getOperatorStats(params)`

Calls `GET /r6/api/v2/operators`. Operator data has its own cache and filters, so it is intentionally separate from `getProfile`.

```javascript
const result = await r6.players.getOperatorStats({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay',
  seasonYear: 'Y11S2',
  modes: 'ranked'
});

console.log(result.player);
console.log(result.filters);
console.log(result.operators.operators);
```

Supported modes are `all`, `ranked`, `standard`, `unranked`, `quick-match`, `casual`, `dual-front`, and `siege-cup`.

### `getLeaderboard(params?)`

Calls `GET /r6/api/v2/leaderboard` and returns rank-points leaderboard entries.

```javascript
const leaderboard = await r6.players.getLeaderboard({
  page: 1,
  platform: 'pc'
});

for (const entry of leaderboard.entries) {
  console.log(
    `#${entry.position}`,
    entry.id,
    entry.rankPoints,
    entry.kd,
    entry.matchesPlayed
  );
}
```

Response:

```jsonc
{
  "platform": "pc",
  "page": 1,
  "entries": [
    {
      "id": "player-id",
      "kd": 1.42,
      "matchesPlayed": 320,
      "rankPoints": 5120,
      "position": 1
    }
  ]
}
```

---

## Game Resource (`r6.game`)

Methods related to game metrics, operators, seasons, maps, and specific game modes.

### `getGameStats()`
Calls `GET /r6/api/v2/gamestats` for current player-count estimates across Steam, Ubisoft Connect, PlayStation, and Xbox.

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

### `getTwitchStats()`

Calls `GET /r6/api/v2/twitchstats` for Rainbow Six Siege Twitch category metrics.

```javascript
const twitch = await r6.game.getTwitchStats();

console.log(twitch.liveViewers.current);
console.log(twitch.channels.live);
console.log(twitch.watchTime.last7Days);
console.log(twitch.category.followers);
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

## Webhooks Resource (`r6.webhooks`)

The `createDiscordR6Webhook()` function allows you to send Rainbow Six Siege player statistics directly to a Discord channel in beautifully formatted dynamic embeds. It automatically detects and formats data from `Ubisoft API` and `Steam`.

```javascript
// Get the complete V2 player profile
const profile = await r6.players.getProfile({
  nameOnPlatform: 'PlayerName',
  platformType: 'uplay',
  platform_families: 'pc'
});

// Send stats directly to Discord webhook
const webhookResult = await r6.webhooks.createDiscordR6Webhook(
  'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
  profile,
  {
    playerName: 'PlayerName',
    title: 'Rainbow Six Siege Stats',
    message: 'Here are the latest R6 stats!',
    color: 0xF99E1A,
    avatarUrl: 'https://example.com/avatar.png'
  }
);
```

---

## Match Replay Resource (`r6.matchReplay`)

Upload Rainbow Six Siege `.rec` replay files and read back the parsed match data
(scoreboard, kill feed, objective events, per-round breakdown, ...). These
methods are served by the website (`https://r6.arenyze.com/api`) rather than by
the public API host, and authenticate with the same API key used by the rest of
the SDK.

> **Notice:** Replay storage is plan-limited (free, pro, ultra, ...). The number
> of replays you can keep is returned in the `quota` field of the upload
> response.

### `uploadReplays(files)` — POST
Uploads one or more `.rec` files belonging to the **same match** and returns the
parsed payload, the saved match summary, and your current quota. You can send up
to **20 files** per request (e.g. one file per round).

Accepted inputs (single value or array):
- a file path string (read from disk)
- raw bytes (`Buffer` / `Uint8Array` / `ArrayBuffer`)
- a `Blob` / `File`
- an object: `{ path, name? }` or `{ name, data }`

```javascript
// Upload a whole match (all the round .rec files at once)
const result = await r6.matchReplay.uploadReplays([
  './replays/Match-2025-Round1.rec',
  './replays/Match-2025-Round2.rec',
  './replays/Match-2025-Round3.rec'
]);

console.log('Match ID:', result.matchID);
console.log('Rounds parsed:', result.rounds.length);
console.log('Saved match:', result.match);
console.log('Quota:', result.quota); // { plan, limit, used, remaining }

// A single file works too
await r6.matchReplay.uploadReplays('./replays/Match-2025-Round1.rec');

// Or raw bytes / Blob with a custom filename
await r6.matchReplay.uploadReplays({ name: 'round1.rec', data: buffer });
```

### `getMatch(matchId)` — GET
Retrieves the parsed data of a previously uploaded match by its `matchID`
(the value returned in the upload response).

```javascript
const replay = await r6.matchReplay.getMatch('the-match-id');

console.log('Match summary:', replay.match);
console.log('Match ID:', replay.matchID);
console.log('Rounds:', replay.rounds);
```

**Response shape:**
```jsonc
{
  "match": {
    "match_id": "…",
    "replay_match_id": "…",
    "title": "Clubhouse",
    "map": "Clubhouse",
    "mode": "Bomb",
    "match_type": "Ranked",
    "rounds_count": 9,
    "blue_score": 5,
    "orange_score": 4,
    "total_kills": 73,
    "players_count": 10
    // …started_at_utc, uploaded_at_utc, updated_at_utc
  },
  "matchID": "…",
  "rounds": [ /* per-round header, scoreboard, kill feed, objective events */ ]
}
```

### TypeScript

```typescript
import { R6Client, ReplayFileInput, UploadReplaysResult, MatchReplayResult } from 'r6-data.js';

const r6 = new R6Client({ apiKey: 'YOUR_API_KEY' });

const files: ReplayFileInput[] = ['./replays/round1.rec', './replays/round2.rec'];

const uploaded: UploadReplaysResult = await r6.matchReplay.uploadReplays(files);
const match: MatchReplayResult = await r6.matchReplay.getMatch(uploaded.matchID);
```

## Error Handling

The package functions throw an exception if an error occurs during API requests. Make sure to handle errors appropriately using try-catch blocks.

## License
This package is fan made, so it has been created for only informational purposes.
