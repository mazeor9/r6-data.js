const createHttpClient = require('./utils/httpClient');
const Players = require('./resources/Players');
const Game = require('./resources/Game');
const Webhooks = require('./resources/Webhooks');

class R6Client {
  /**
   * @param {{ apiKey: string }} config - Configuration options
   */
  constructor(config) {
    if (!config || !config.apiKey) {
      throw new Error('Missing required config parameter: apiKey');
    }

    /** @type {string} */
    this.apiKey = config.apiKey;

    this.httpClient = createHttpClient(this.apiKey);

    this.players = new Players(this);
    this.game = new Game(this);
    this.webhooks = new Webhooks(this);
  }
}

module.exports = R6Client;