
## R6-INFO.js
  A simple wrapper for the Rainbow Six Siege API that allows you to easily retrieve information about maps, operators, ranks, seasons, charms and service status.
  <div align="center">
  <p>
    <a href="https://github.com/mazeor7/r6-info.js/releases/latest">
  <img src="https://img.shields.io/github/v/release/mazeor7/r6-info.js?style=for-the-badge" alt="GitHub release (latest SemVer)" /></a>
    <a href="https://github.com/mazeor7/r6-info.js/releases/latest">
    <img src="https://img.shields.io/github/release-date/mazeor7/r6-info.js?label=latest%20release&style=for-the-badge" alt="Latest release" /></a>
   <a href="https://www.npmjs.com/package/r6-info.js"><img src="https://img.shields.io/npm/v/r6-info.js.svg?logo=npm&style=for-the-badge" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/r6-info.js"><img src="https://img.shields.io/npm/dt/r6-info.js.svg?style=for-the-badge" alt="NPM downloads" /></a>
  </p>
</div>

## Installation

```sh
npm install r6info.js
```
```sh
npm i r6-info.js
```

`Last updated Y10S1`

## Getting Player Stats and Account Information

The `getStats()` function allows you to retrieve player statistics and account information from the official Rainbow Six Siege API. This function supports two types of requests: `accountInfo` for retrieving player profile data and `stats` for retrieving gameplay statistics.

```javascript
const r6Info = require('r6-info.js');

async function main() {
  try {
    // Get player account information
    const accountInfo = await r6Info.getStats({
      type: 'accountInfo',
      email: 'your-ubisoft-email@example.com',
      password: 'your-password',
      nameOnPlatform: 'PlayerName',
      platformType: 'uplay'
    });
    console.log('Player account information:', accountInfo);
    
    // Get player statistics
    const playerStats = await r6Info.getStats({
      type: 'stats',
      email: 'your-ubisoft-email@example.com',
      password: 'your-password',
      nameOnPlatform: 'PlayerName',
      platformType: 'uplay',
      platform_families: 'pc'
    });
    console.log('Player statistics:', playerStats);
    
  } catch (error) {
    console.error('Error retrieving player data:', error.message);
  }
}

main();
```


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
const r6Info = require('r6-info.js');

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

### Version 2 (v2)

```javascript
const r6Info = require('r6-info.js');

async function main() {

  try {
    
    const ranksV2 = await r6Info.getRanks({ version: 'v2' });
    console.log('All ranks for version v2:', ranksV2);

    const filteredRanksV2 = await r6Info.getRanks({ min_mmr: 2600, max_mmr: 3100, version: 'v2' });
    console.log('Filtered ranks for version v2:', filteredRanksV2);
    
  } catch (error) {
    console.error('Error while requesting ranks:', error.message);
  }
}

main();
```
Similar to version 1, this example retrieves all ranks for version 2 of the ranking system and demonstrates filtering the ranks based on MMR range.

The examples for versions 3 to 6 follow the same pattern, with the only difference being the version parameter value and the specific MMR ranges used for filtering.

### Version 3 (v3)

```javascript
const r6Info = require('r6-info.js');

async function main() {

  try {
    
    const ranksV3 = await r6Info.getRanks({ version: 'v3' });
    console.log('All ranks for version v3:', ranksV3);

    const filteredRanksV3 = await r6Info.getRanks({ min_mmr: 3200, max_mmr: 3700, version: 'v3' });
    console.log('Filtered ranks for version v3:', filteredRanksV3);
    
  } catch (error) {
    console.error('Error while requesting ranks:', error.message);
  }
}

main();
```

### Version 4 (v4)

```javascript
const r6Info = require('r6-info.js');

async function main() {

  try {
    
    const ranksV4 = await r6Info.getRanks({ version: 'v4' });
    console.log('All ranks for version v4:', ranksV4);

    const filteredRanksV4 = await r6Info.getRanks({ min_mmr: 3800, max_mmr: 4300, version: 'v4' });
    console.log('Filtered ranks for version v4:', filteredRanksV4);
    
  } catch (error) {
    console.error('Error while requesting ranks:', error.message);
  }
}

main();
```

### Version 5 (v5)

```javascript
const r6Info = require('r6-info.js');

async function main() {

  try {
    
    const ranksV5 = await r6Info.getRanks({ version: 'v5' });
    console.log('All ranks for version v5:', ranksV5);

    const filteredRanksV5 = await r6Info.getRanks({ min_mmr: 4400, max_mmr: 4900, version: 'v5' });
    console.log('Filtered ranks for version v5:', filteredRanksV5);
    
  } catch (error) {
    console.error('Error while requesting ranks:', error.message);
  }
}

main();
```


### Version 6 (v6)

```javascript
const r6Info = require('r6-info.js');

async function main() {

  try {
    
    const ranksV6 = await r6Info.getRanks({ version: 'v6' });
    console.log('All ranks for version v6:', ranksV6);

    const filteredRanksV6 = await r6Info.getRanks({ min_mmr: 5000, max_mmr: 5500, version: 'v6' });
    console.log('Filtered ranks for version v6:', filteredRanksV6);
    
  } catch (error) {
    console.error('Error while requesting ranks:', error.message);
  }
}

main();
```

## Getting Service Status

The `getServiceStatus()` function allows you to retrieve the current status of the Rainbow Six Siege game servers. This information can be useful for monitoring the health and availability of the game service. Here's an example of how to use the `getServiceStatus()` function:

```javascript
const r6Info = require('r6-info.js');

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
const r6Info = require('r6-info.js');

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
const r6Info = require('r6-info.js');

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
    
    // Filter operators by health
    const filteredOperatorsByHealth = await r6Info.getOperators({ health: 1 });
    console.log('Operators filtered by health:', filteredOperatorsByHealth);
    
    // Filter operators by speed
    const filteredOperatorsBySpeed = await r6Info.getOperators({ speed: 3 });
    console.log('Operators filtered by speed:', filteredOperatorsBySpeed);

    // Filter operators by unit
    const filteredOperatorsByUnit = await r6Info.getOperators({ unit: 'FBI SWAT' });
    console.log('Operators filtered by unit:', filteredOperatorsByUnit);

    // Filter operators by country code
    const filteredOperatorsByCountryCode = await r6Info.getOperators({ country_code: 'US' });
    console.log('Operators filtered by country code:', filteredOperatorsByCountryCode);

    // Filter operators by roles
    const filteredOperatorsByRoles = await r6Info.getOperators({ roles: 'attacker' });
    console.log('Operators filtered by roles:', filteredOperatorsByRoles);

    // Filter operators by side
    const filteredOperatorsBySide = await r6Info.getOperators({ side: 'attacker' });
    console.log('Operators filtered by side:', filteredOperatorsBySide);
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
9. Filtering operators by health using the `health` parameter.
10. Filtering operators by speed using the `speed` parameter.
11. Filtering operators by unit using the `unit` parameter.
12. Filtering operators by country code using the `country_code` parameter.
13. Filtering operators by roles using the `roles` parameter.
14. Filtering operators by side using the `side` parameter.

These filtering options provide flexibility in retrieving specific subsets of operators based on various criteria. You can use them individually or combine them to narrow down the results according to your needs.

## Getting Season Information

The `getSeasons()` function allows you to retrieve information about the seasons in Rainbow Six Siege. You can get a list of all seasons or filter the seasons based on specific criteria. Here's an example of how to use the `getSeasons()` function:

```javascript
const r6Info = require('r6-info.js');

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

    // Filter seasons by description
    const filteredSeasonsByDescription = await r6Info.getSeasons({ description: 'Operation Black Ice brings a new map and two new operators to the game.' });
    console.log('Seasons filtered by description:', filteredSeasonsByDescription);

    // Filter seasons by code
    const filteredSeasonsByCode = await r6Info.getSeasons({ code: 'Y1S1' });
    console.log('Seasons filtered by code:', filteredSeasonsByCode);

    // Filter seasons by start date
    const filteredSeasonsByStartDate = await r6Info.getSeasons({ startDate: '2016-02-02' });
    console.log('Seasons filtered by start date:', filteredSeasonsByStartDate);
    
  } catch (error) {
    console.error('Error while requesting seasons:', error.message);
  }
}

main();
```

Retrieving all seasons by calling `getSeasons()` without any parameters.
Filtering seasons by name using the `name` parameter.
Filtering seasons by map using the `map` parameter.
Filtering seasons by operators using the `operators` parameter.
Filtering seasons by weapons using the `weapons` parameter.
Filtering seasons by description using the `description` parameter.
Filtering seasons by code using the `code` parameter.
Filtering seasons by start date using the `startDate` parameter.
These filtering options allow you to retrieve specific seasons based on different criteria. You can use them individually or combine them to get the desired subset of seasons.

## Getting Attachment Information

The `getAttachment()` function allows you to retrieve information about the attachments available in Rainbow Six Siege. You can get a list of all attachments or filter the attachments based on specific criteria. Here's an example of how to use the `getAttachment()` function:

```javascript
const r6Info = require('r6-info.js');

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
    
    // Filter attachments by bundle
    const filteredAttachmentsByBundle = await r6Info.getAttachment({ bundle: '"Crimson Heist Battlepass"' });
    console.log('Attachments filtered by bundle:', filteredAttachmentsByBundle);
    
    // Filter attachments by season
    const filteredAttachmentsBySeason = await r6Info.getAttachment({ season: '"North Star"' });
    console.log('Attachments filtered by season:', filteredAttachmentsBySeason);
    
  } catch (error) {
    console.error('Error while requesting attachments:', error.message);
  }
}

main();
```

Retrieving all attachments by calling `getAttachment()` without any parameters.
Filtering attachments by name using the `name` parameter.
Filtering attachments by style using the `style` parameter.
Filtering attachments by rarity using the `rarity` parameter.
Filtering attachments by availability using the `availability` parameter.
Filtering attachments by bundle using the `bundle` parameter.
Filtering attachments by season using the `season` parameter.
These filtering options provide flexibility in retrieving specific subsets of attachments based on various criteria. You can use them individually or combine them to narrow down the results according to your needs.


## Getting Charm Information

```javascript
const r6Info = require('r6-info.js');

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
const r6Info = require('r6-info.js');

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
const r6Info = require('r6-info.js');

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
