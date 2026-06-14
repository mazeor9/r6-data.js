const fs = require('fs');
const path = require('path');

/** @typedef {import('../R6Client')} R6Client */
/** @typedef {import('../../types/params-interfaces').ReplayFileInput} ReplayFileInput */
/** @typedef {import('../../types/result-interfaces').MatchReplayResult} MatchReplayResult */
/** @typedef {import('../../types/result-interfaces').UploadReplaysResult} UploadReplaysResult */

/**
 * @typedef {Error & {
 *   response?: {
 *     status?: number,
 *     data?: any,
 *     headers?: Record<string, string>
 *   }
 * }} HttpClientError
 */

/**
 * @param {unknown} error
 * @returns {HttpClientError}
 */
function asHttpError(error) {
  return /** @type {HttpClientError} */ (error);
}

/**
 * @param {string} name
 * @returns {boolean}
 */
function isRecFilename(name) {
  return path.extname(String(name || '')).toLowerCase() === '.rec';
}

/**
 * Normalize a single replay file entry into a `{ name, blob }` pair ready to be
 * appended to a multipart FormData body.
 * @param {ReplayFileInput} file
 * @returns {Promise<{ name: string, blob: Blob }>}
 */
async function toUploadEntry(file) {
  // Absolute/relative path on disk
  if (typeof file === 'string') {
    const data = await fs.promises.readFile(file);
    return { name: path.basename(file), blob: new Blob([/** @type {any} */ (data)]) };
  }

  // Already a Blob/File (browser-like or manually built)
  if (typeof Blob !== 'undefined' && file instanceof Blob) {
    const name = /** @type {any} */ (file).name || 'replay.rec';
    return { name, blob: file };
  }

  // Raw bytes
  if (Buffer.isBuffer(file) || file instanceof Uint8Array || file instanceof ArrayBuffer) {
    return { name: 'replay.rec', blob: new Blob([/** @type {any} */ (file)]) };
  }

  const obj = /** @type {{ name?: string, data?: any, path?: string }} */ (file);
  if (obj && typeof obj === 'object') {
    // { path, name? }
    if (typeof obj.path === 'string' && obj.path) {
      const data = await fs.promises.readFile(obj.path);
      return { name: obj.name || path.basename(obj.path), blob: new Blob([/** @type {any} */ (data)]) };
    }
    // { data, name? }
    if (obj.data != null) {
      const blob = obj.data instanceof Blob ? obj.data : new Blob([/** @type {any} */ (obj.data)]);
      return { name: obj.name || 'replay.rec', blob };
    }
  }

  throw new Error('Invalid replay file entry. Provide a file path, Buffer, Blob, or { path } / { name, data } object.');
}

class MatchReplay {
  /**
   * @param {R6Client} client - The main client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get the parsed data of an uploaded match replay by its replay matchID.
   *
   * Wraps `GET /replays/api/matches/:matchId`, the API-key authenticated
   * endpoint of the r6data replay service. Returns the match summary together
   * with the normalized per-round payload (header, scoreboard, kill feed,
   * objective events, ...) extracted from the original `.rec` files.
   *
   * @param {string} matchId - The replay matchID returned when the replay was uploaded.
   * @returns {Promise<MatchReplayResult>}
   */
  async getMatch(matchId) {
    try {
      if (!matchId || typeof matchId !== 'string') {
        throw new Error('Missing required parameter: matchId (string)');
      }

      const url = `/replays/api/matches/${encodeURIComponent(matchId)}`;
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getMatch request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      if (err.response?.status === 404) {
        throw new Error('Replay match not found');
      }
      throw err;
    }
  }

  /**
   * Upload one or more `.rec` replay files belonging to the same match.
   *
   * Wraps `POST /replays/api/upload`, the API-key authenticated upload endpoint
   * of the r6data replay service. The files are sent as multipart/form-data
   * under the `replayFiles` field (up to 20 per request). All files must belong
   * to the same match (same matchID) or the server rejects the request.
   *
   * Accepted inputs (single value or array):
   * - a file path string (read from disk)
   * - a Buffer / Uint8Array of file bytes
   * - a Blob / File
   * - an object `{ path, name? }` or `{ name, data }`
   *
   * @param {ReplayFileInput | ReplayFileInput[]} files
   * @returns {Promise<UploadReplaysResult>}
   */
  async uploadReplays(files) {
    try {
      const list = Array.isArray(files) ? files.filter(Boolean) : [files].filter(Boolean);
      if (!list.length) {
        throw new Error('Missing required parameter: at least one .rec file is required');
      }
      if (list.length > 20) {
        throw new Error('Too many files: a maximum of 20 .rec files can be uploaded per request');
      }

      const entries = await Promise.all(list.map(toUploadEntry));

      for (const entry of entries) {
        if (!isRecFilename(entry.name)) {
          throw new Error(`Invalid file "${entry.name}". Only .rec replay files are allowed.`);
        }
      }

      const formData = new FormData();
      for (const entry of entries) {
        formData.append('replayFiles', entry.blob, entry.name);
      }

      const response = await this.client.httpClient.postForm('/replays/api/upload', formData);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the uploadReplays request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      if (err.response?.status === 403) {
        throw new Error(err.response?.data?.error || 'Replay upload limit reached for your plan');
      }
      throw err;
    }
  }
}

module.exports = MatchReplay;
