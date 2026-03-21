const createHttpClient = require('./utils/httpClient');
const Players = require('./resources/Players');
const Game = require('./resources/Game');
const Webhooks = require('./resources/Webhooks');

class R6Client {
  /**
   * @param {Object} config - Configuration options
   * @param {string} config.apiKey - Your API Key from r6data.eu
   */
  constructor(config = {}) {
    if (!config.apiKey) {
      throw new Error('Missing required config parameter: apiKey');
    }
    
    this.apiKey = config.apiKey;
    this.httpClient = createHttpClient(this.apiKey);

    this.players = new Players(this);
    this.game = new Game(this);
    this.webhooks = new Webhooks(this);
  }
}

module.exports = R6Client;
