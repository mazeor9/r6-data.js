## r6-data.js
  Rainbow Six Siege API wrapper that gives infos about player's stats, maps, operators, ranks, seasons, charms etc. Last updated Y10S3

  <div align="center">
  <p>
    <a href="https://github.com/mazeor9/r6-data.js/releases/latest">
  <img src="https://img.shields.io/github/v/release/mazeor9/r6-data.js?style=for-the-badge" alt="GitHub release (latest SemVer)" /></a>
    <a href="https://github.com/mazeor9/r6-data.js/releases/latest">
    <img src="https://img.shields.io/github/release-date/mazeor9/r6-data.js?label=latest%20release&style=for-the-badge" alt="Latest release" /></a>
   <a href="https://www.npmjs.com/package/r6-data.js"><img src="https://img.shields.io/npm/v/r6-data.js.svg?logo=npm&style=for-the-badge" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/r6-data.js"><img src="https://img.shields.io/npm/dt/r6-data.js.svg?style=for-the-badge" alt="NPM downloads" /></a>
  </p>
</div>

## Installation

```sh
npm install r6-data.js
```
```sh
npm i r6-data.js
```

## R6Data Website for stats and API

This is the website where you can directly track your stats and also check the all infos that gives r6-data.js. Entire website is based on r6-data.js.

Visit the official website: **[r6data.eu](https://r6data.eu/)**

## Getting Player Account Information

The `getAccountInfo()` function allows you to retrieve player profile data from the official Rainbow Six Siege API. This function is specifically designed for retrieving account information such as player level, experience, clearance level, and profile settings.

```javascript
const r6Info = require('r6-data.js');

async function main() {
  try {
    // Get player account information
    const accountInfo = await r6Info.getAccountInfo({
      nameOnPlatform: 'PlayerName',
      platformType: 'uplay'
    });
    
    console.log('Account information:', accountInfo);
    return accountInfo;
    
  } catch (error) {
    console.error('Error retrieving account information:', error.message);
  }
}

main();
```

### Parameters

The `getAccountInfo()` function accepts an object with the following parameters:

- `nameOnPlatform`: (Required) The player's name on the platform
- `platformType`: (Required) The platform type - "uplay", "psn", or "xbl"

### Account Information Response
When using `getAccountInfo()`, you'll receive data about the player's profile, including:

- Player level and experience
- Clearance level
- Achievement status
- Play time statistics
- Player profile settings and customization

## Getting Player Statistics

The `getPlayerStats()` function allows you to retrieve detailed gameplay statistics from the official Rainbow Six Siege API. This function is specifically designed for retrieving player performance data across different game modes.

```javascript
const r6Info = require('r6-data.js');

async function main() {
  try {
    // Get player statistics
    const playerStats = await r6Info.getPlayerStats({
      nameOnPlatform: 'PlayerName',
      platformType: 'uplay',
      platform_families: 'pc'
    });

    console.log('Player statistics:', playerStats);
    return playerStats;

    // Get player statistics for ranked mode only
    const rankedStats = await r6Info.getPlayerStats({
      nameOnPlatform: 'PlayerName',
      platformType: 'uplay',
      platform_families: 'pc',
      board_id: 'ranked'
    });
    
    console.log('Ranked statistics:', rankedStats);
    return rankedStats;
    
  } catch (error) {
    console.error('Error retrieving player statistics:', error.message);
  }
}

main();
```

### Parameters

The `getPlayerStats()` function accepts an object with the following parameters:

- `nameOnPlatform`: (Required) The player's name on the platform
- `platformType`: (Required) The platform type - "uplay", "psn", or "xbl"
- `platform_families`: (Required) The platform family - "pc" or "console"
- `board_id`: (Optional) The game mode to filter statistics - "casual", "event", "warmup", "standard", or "ranked"

### Player Statistics Response
When using `getPlayerStats()`, you'll receive detailed gameplay statistics, including:

- Rank information
- MMR (Matchmaking Rating)
- Win/loss records
- Seasonal performance data
- Skill metrics across different gameplay modes

You can filter these statistics by game mode using the `board_id` parameter:

- `casual`: Statistics for casual matches
- `event`: Statistics for limited-time events
- `warmup`: Statistics for warmup matches
- `standard`: Statistics for standard matches
- `ranked`: Statistics for ranked competitive matches


## Getting Seasonal Statistics

The `getSeasonalStats()` function allows you to get detailed rank points history and seasonal progression for a specific player in the current season. Includes timestamp, rank information, RP values, and rank images

```javascript
const r6Info = require('r6-data.js');

async function main() {
  try {
    // Get seasonal statistics for a player
    const seasonalStats = await r6Info.getSeasonalStats({
      nameOnPlatform: 'PlayerName',
      platformType: 'uplay'
    });

    console.log('Seasonal statistics:', seasonalStats);
    return seasonalStats;
    
  } catch (error) {
    console.error('Error retrieving seasonal statistics:', error.message);
  }
}

main();
```

### Parameters

The `getSeasonalStats()` function accepts an object with the following parameters:

- `nameOnPlatform`: (Required) The player's name on the platform
- `platformType`: (Required) The platform type - "uplay", "psn", or "xbl"

### Seasonal Statistics Response

```javascript
          {
            "data": {
                "history": {
                "metadata": {
                    "key": "RankPoints",
                    "name": "Rank Points",
                    "description": null
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
                    ],
                    [
                    "2025-10-14T21:12:55.821+00:00",
                    {
                        "displayName": "Rank Points",
                        "metadata": {
                        "rank": "PLATINUM II",
                        "imageUrl": "https://r6data.eu/assets/img/r6_ranks_img/platinum-2.webp",
                        "color": "#44ccc2"
                        },
                            "value": 3302,
                            "displayValue": "3,302",
                            "displayType": "Number"
                        }
                    ]
                ]
                },
                "leaderboard": null,
                "expiryDate": "0001-01-01T00:00:00+00:00",
                "bestMatches": null
            }
```

## Getting Game Statistics

The `getGameStats()` function allows you to get real-time player count statistics across all platforms including Steam, Ubisoft Connect, PlayStation, Xbox, and total player counts

```javascript
const r6Info = require('r6-data.js');

async function main() {
  try {
    // Get general game statistics
    const gameStats = await r6Info.getGameStats();

    console.log('Game statistics:', gameStats);
    return gameStats;
    
  } catch (error) {
    console.error('Error retrieving game statistics:', error.message);
  }
}

main();
```

### Game Statistics Response
```javascript
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

## Creating Discord Webhooks for R6 Stats

The `createDiscordR6Webhook()` function allows you to send Rainbow Six Siege player statistics directly to a Discord channel using webhooks. This creates formatted embeds with player stats that can be customized with various options.

```javascript
const r6Info = require('r6-data.js');

async function main() {
  try {
    // First, get player statistics
    const playerStats = await r6Info.getPlayerStats({
      nameOnPlatform: 'PlayerName',
      platformType: 'uplay',
      platform_families: 'pc'
    });

    // Send stats to Discord webhook
    const webhookResult = await r6Info.createDiscordR6Webhook(
      'https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN',
      playerStats,
      {
        playerName: 'PlayerName',
        title: 'Rainbow Six Siege Stats',
        message: 'Here are the latest R6 stats!',
        color: 0xF99E1A, // Orange color
        avatarUrl: 'https://example.com/avatar.png'
      }
    );

    console.log('Webhook sent successfully:', webhookResult);
    
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

main();
```

### Parameters
The `createDiscordR6Webhook()` function accepts the following parameters:
- `webhookUrl`: (Required) The Discord webhook URL
- `playerData`: (Required) Player statistics data from getPlayerStats() or getAccountInfo()
- `options`: (Required) Configuration object with the following properties:
  - `playerName`: (Required) The player's name to display
  - `title`: (Optional) Custom title for the embed (default: "Rainbow Six Siege Stats")
  - `message`: (Optional) Custom message content above the embed
  - `color`: (Optional) Embed color in hexadecimal format (default: 0xF99E1A)
  - `avatarUrl`: (Optional) URL for the player's avatar thumbnail

###  Supported Data Formats
The function automatically detects and formats different data sources:

`Ubisoft API data`: From getPlayerStats() - displays ranked/standard statistics
`Steam data`: Custom Steam-formatted statistics
`Custom data`: Any custom statistics object

### Discord Webhook Setup
To use this function, you need to create a webhook in your Discord server:

1. Go to your Discord server settings
2. Navigate to Integrations → Webhooks
3. Click "New Webhook"
4. Copy the webhook URL
5. Use this URL in the `createDiscordR6Webhook()` function

## Searching Across All Entities

The `getSearchAll()` function allows you to search across all Rainbow Six Siege entities (operators, weapons, maps, seasons, charms, and attachments) with a single query. This is useful for finding relevant information across multiple categories at once.

```javascript
const r6Info = require('r6-data.js');

async function main() {
  try {
    // Search for all entities containing "black"
    const searchResults = await r6Info.getSearchAll('black');
    console.log('Search results summary:', searchResults.summary);
    
    // Access specific result categories
    console.log('Operator results:', searchResults.results.operators);
    console.log('Weapon results:', searchResults.results.weapons);
    console.log('Map results:', searchResults.results.maps);
    console.log('Season results:', searchResults.results.seasons);
    console.log('Charm results:', searchResults.results.charms);
    console.log('Attachment results:', searchResults.results.attachments);
    
    // Search for a specific operator
    const operatorSearch = await r6Info.getSearchAll('ash');
    console.log('Ash search results:', operatorSearch);
    
    // Search for a specific map
    const mapSearch = await r6Info.getSearchAll('bank');
    console.log('Bank search results:', mapSearch);
    
  } catch (error) {
    console.error('Error during search:', error.message);
  }
}

main();
```

### Parameters

The `getSearchAll()` function accepts a single required parameter:

- `query`: (Required) The search term to query across all entities

### Search Results

The function returns a structured object containing:

- query: The original search term
- summary: A summary object with counts of results by category and total
- results: An object containing arrays of results for each entity type:
  - operators: Array of operator results
  - weapons: Array of weapon results
  - maps: Array of map results
  - seasons: Array of season results
  - charms: Array of charm results
  - attachments: Array of attachment results


Each result includes an `entity_type` field indicating its category, along with relevant data fields for that entity type.

## Getting Rank Information

The `getRanks()` function supports retrieving rank information across different versions of the game's ranking system, from v1 to v6. This flexibility allows users to query rank data that aligns with specific game seasons or ranking system updates. Here are examples demonstrating how to use the `getRanks()` function for each version, including filtering options for `min_mmr` and `max_mmr`.

`v1: Until Y1S3 | #3 | Skull Rain`

`v2: Y1S4 | #4 | Red Crow`

`v3: Y2S1 - Y4S2 | #5 - #14 | Velvet Shell - Phantom Sight`

`v4: Y4S3 - Y6S2 | #15 - #22 | Ember Rise - North Star`

`v5: Y6S3 - Y7S3 | #23 - #27 | Crystal Guard - Brutal Swarm`

`V6: Y7S4+ | #28+ | Solar Raid+ (Ranked 2.0)`

### Version 1 (v1)

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {
    
    const ranksV1 = await r6Info.getRanks({ version: 'v1' });
    console.log('All ranks for version v1:', ranksV1);

    const filteredRanksV1 = await r6Info.getRanks({ min_mmr: 2000, max_mmr: 2500, version: 'v1' });
    console.log('Filtered ranks for version v1:', filteredRanksV1);
    
  } catch (error) {
    console.error('Error while requesting ranks:', error.message);
  }
}

main();
```
`getRanks()` function with the version parameter set to 'v1' to retrieve all ranks for version 1 of the ranking system. We also demonstrate filtering the ranks by specifying the min_mmr and max_mmr parameters to get ranks within a specific MMR range.

For the others versions you can replace the v1 with v2, v3... and the others parameters


## Getting Service Status

The `getServiceStatus()` function allows you to retrieve the current status of the Rainbow Six Siege game servers. This information can be useful for monitoring the health and availability of the game service. Here's an example of how to use the `getServiceStatus()` function:

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {

    const serviceStatus = await r6Info.getServiceStatus();
    console.log('Service status:', serviceStatus);
    
  } catch (error) {
    console.error('Error while requesting service status:', error.message);
  }
}

main();
```

## Getting Map Information

The `getMaps()` function allows you to retrieve information about the maps available in Rainbow Six Siege. You can get a list of all maps or filter the maps based on specific criteria. Here's an example of how to use the `getMaps()` function:

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {

    // Get all maps
    const maps = await r6Info.getMaps();
    console.log('All maps:', maps);
    
    // Filter maps by name
    const filteredMapsByName = await r6Info.getMaps({ name: 'Bank' });
    console.log('Maps filtered by name:', filteredMapsByName);
    
    // Filter maps by location
    const filteredMapsByLocation = await r6Info.getMaps({ location: 'USA' });
    console.log('Maps filtered by location:', filteredMapsByLocation);
    
    // Filter maps by release date
    const filteredMapsByReleaseDate = await r6Info.getMaps({ releaseDate: '2015-12-01' });
    console.log('Maps filtered by release date:', filteredMapsByReleaseDate);
    
    // Filter maps by playlists
    const filteredMapsByPlaylists = await r6Info.getMaps({ playlists: 'ranked' });
    console.log('Maps filtered by playlists:', filteredMapsByPlaylists);
    
    // Filter maps by rework status
    const filteredMapsByRework = await r6Info.getMaps({ mapReworked: true });
    console.log('Maps filtered by rework status:', filteredMapsByRework);
    
  } catch (error) {
    console.error('Error while requesting maps:', error.message);
  }
}

main();
```

Retrieving all maps by calling `getMaps()` without any parameters.
Filtering maps by name using the `name` parameter.
Filtering maps by location using the `location` parameter.
Filtering maps by release date using the `releaseDate` parameter.
Filtering maps by playlists using the `playlists` parameter.
Filtering maps by rework status using the `mapReworked` parameter.
You can use these filtering options individually or combine them to retrieve specific subsets of maps based on your requirements.

## Getting Operator Information

The `getOperators()` function allows you to retrieve information about the operators available in Rainbow Six Siege. You can get a list of all operators or filter the operators based on specific criteria. Here's an example of how to use the `getOperators()` function:

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {

    // Get all operators
    const operators = await r6Info.getOperators();
    console.log('All operators:', operators);
    
    // Filter operators by name
    const filteredOperatorsByName = await r6Info.getOperators({ name: 'Ash' });
    console.log('Operators filtered by name:', filteredOperatorsByName);
    
    // Filter operators by safe name
    const filteredOperatorsBySafeName = await r6Info.getOperators({ safename: 'recruit' });
    console.log('Operators filtered by safe name:', filteredOperatorsBySafeName);
    
    // Filter operators by real name
    const filteredOperatorsByRealName = await r6Info.getOperators({ realname: 'Eliza Cohen' });
    console.log('Operators filtered by real name:', filteredOperatorsByRealName);
    
    // Filter operators by birthplace
    const filteredOperatorsByBirthplace = await r6Info.getOperators({ birthplace: 'Jerusalem, Israel' });
    console.log('Operators filtered by birthplace:', filteredOperatorsByBirthplace);
    
    // Filter operators by age
    const filteredOperatorsByAge = await r6Info.getOperators({ age: 33 });
    console.log('Operators filtered by age:', filteredOperatorsByAge);
    
    // Filter operators by date of birth
    const filteredOperatorsByDateOfBirth = await r6Info.getOperators({ date_of_birth: '1984-12-24' });
    console.log('Operators filtered by date of birth:', filteredOperatorsByDateOfBirth);
    
    // Filter operators by season introduced
    const filteredOperatorsBySeasonIntroduced = await r6Info.getOperators({ season_introduced: 'Y1S1' });
    console.log('Operators filtered by season introduced:', filteredOperatorsBySeasonIntroduced);
    
    } catch (error) {
    console.error('Error while requesting operators:', error.message);
    }
  }

main();
```

1. Retrieving all operators by calling `getOperators()` without any parameters.
2. Filtering operators by name using the `name` parameter.
3. Filtering operators by safe name using the `safename` parameter.
4. Filtering operators by real name using the `realname` parameter.
5. Filtering operators by birthplace using the `birthplace` parameter.
6. Filtering operators by age using the `age` parameter.
7. Filtering operators by date of birth using the `date_of_birth` parameter.
8. Filtering operators by season introduced using the `season_introduced` parameter.

You can get the operator url icon via r6Info.getOperators(), is in the json response.

## Getting Season Information

The `getSeasons()` function allows you to retrieve information about the seasons in Rainbow Six Siege. You can get a list of all seasons or filter the seasons based on specific criteria. Here's an example of how to use the `getSeasons()` function:

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {

    // Get all seasons
    const seasons = await r6Info.getSeasons();
    console.log('All seasons:', seasons);

    // Filter seasons by name
    const filteredSeasonsByName = await r6Info.getSeasons({ name: 'Black Ice' });
    console.log('Seasons filtered by name:', filteredSeasonsByName);

    // Filter seasons by map
    const filteredSeasonsByMap = await r6Info.getSeasons({ map: 'Yacht' });
    console.log('Seasons filtered by map:', filteredSeasonsByMap);

    // Filter seasons by operators
    const filteredSeasonsByOperators = await r6Info.getSeasons({ operators: 'Buck, Frost' });
    console.log('Seasons filtered by operators:', filteredSeasonsByOperators);

    // Filter seasons by weapons
    const filteredSeasonsByWeapons = await r6Info.getSeasons({ weapons: 'C8-SFW, Super 90' });
    console.log('Seasons filtered by weapons:', filteredSeasonsByWeapons);

  } catch (error) {
    console.error('Error while requesting seasons:', error.message);
  }
}

main();
```

Retrieving all seasons by calling `getSeasons()` without any parameters.
- Filtering seasons by name using the `name` parameter.
- Filtering seasons by map using the `map` parameter.
- Filtering seasons by operators using the `operators` parameter.
- Filtering seasons by weapons using the `weapons` parameter.

## Getting Attachment Information

The `getAttachment()` function allows you to retrieve information about the attachments available in Rainbow Six Siege. You can get a list of all attachments or filter the attachments based on specific criteria. Here's an example of how to use the `getAttachment()` function:

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {

    // Get all attachments
    const attachments = await r6Info.getAttachment();
    console.log('All attachments:', attachments);
    
    // Filter attachments by name
    const filteredAttachmentsByName = await r6Info.getAttachment({ name: 'Red Dot Sight' });
    console.log('Attachments filtered by name:', filteredAttachmentsByName);
    
    // Filter attachments by style
    const filteredAttachmentsByStyle = await r6Info.getAttachment({ style: 'colour' });
    console.log('Attachments filtered by style:', filteredAttachmentsByStyle);
    
    // Filter attachments by rarity
    const filteredAttachmentsByRarity = await r6Info.getAttachment({ rarity: 'common' });
    console.log('Attachments filtered by rarity:', filteredAttachmentsByRarity);
    
    // Filter attachments by availability
    const filteredAttachmentsByAvailability = await r6Info.getAttachment({ availability: 'removed' });
    console.log('Attachments filtered by availability:', filteredAttachmentsByAvailability);
    
  } catch (error) {
    console.error('Error while requesting attachments:', error.message);
  }
}

main();
```

Retrieving all attachments by calling `getAttachment()` without any parameters.
- Filtering attachments by name using the `name` parameter.
- Filtering attachments by style using the `style` parameter.
- Filtering attachments by rarity using the `rarity` parameter.
- Filtering attachments by availability using the `availability` parameter.

## Getting Charm Information

```javascript
const r6Info = require('r6-data.js');

// Get all charms
const charms = await r6Info.getCharms();
console.log('All charms:', charms);

// Filter charms by specific criteria
const filteredCharms = await r6Info.getCharms({
    name: 'Chibi',
    collection: 'Year 1',
    rarity: 'legendary',
    availability: 'available',
    bundle: 'Pro League Set',
    season: 'Burnt Horizon'
});
```

The `getCharms()` function allows you to retrieve information about the charms available in Rainbow Six Siege. You can get all charms or filter them based on specific criteria:

- `name`: Filter by charm name
- `collection`: Filter by charm collection
- `rarity`: Filter by rarity level (common, uncommon, rare, epic, legendary)
- `availability`: Filter by availability status
- `bundle`: Filter by bundle name
- `season`: Filter by season released

## Getting Weapon Information

The `getWeapons()` function allows you to retrieve information about the weapons available in Rainbow Six Siege. You can get a list of all weapons or filter them by name. Here's an example of how to use the `getWeapons()` function:

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {

    // Get all weapons
    const weapons = await r6Info.getWeapons();
    console.log('All weapons:', weapons);
    
    // Filter weapons by name
    const filteredWeaponsByName = await r6Info.getWeapons({ name: 'F2' });
    console.log('Weapons filtered by name:', filteredWeaponsByName);
    
  } catch (error) {
    console.error('Error while requesting weapons:', error.message);
  }
}

main();
```

The `getWeapons()` function retrieves information about the weapons in Rainbow Six Siege. You can:

- Retrieve all weapons by calling `getWeapons()` without any parameters
- Filter weapons by name using the `name` parameter

## Getting Universal Skin Information

The `getUniversalSkins()` function allows you to retrieve information about the universal skins available in Rainbow Six Siege. You can get a list of all universal skins or filter them by name. Here's an example of how to use the `getUniversalSkins()` function:

```javascript
const r6Info = require('r6-data.js');

async function main() {

  try {

    // Get all universal skins
    const universalSkins = await r6Info.getUniversalSkins();
    console.log('All universal skins:', universalSkins);
    
    // Filter universal skins by name
    const filteredSkinsByName = await r6Info.getUniversalSkins({ name: 'Black Ice' });
    console.log('Universal skins filtered by name:', filteredSkinsByName);
    
  } catch (error) {
    console.error('Error while requesting universal skins:', error.message);
  }
}

main();
```

The `getUniversalSkins()` function retrieves information about universal weapon skins in Rainbow Six Siege. You can:

- Retrieve all universal skins by calling `getUniversalSkins()` without any parameters
- Filter universal skins by name using the name parameter

## Error Handling
The package functions throw an exception if an error occurs during API requests. Make sure to handle errors appropriately using try-catch blocks.

If the access token has expired or is invalid, an exception will be thrown with the message "Token expired or invalid". In this case, you need to obtain a new token using the getToken() function.

## License
This package is fan made, so it has been created for only informational purposes
