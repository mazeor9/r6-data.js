const pkg = require('../../package.json');

const BASE_URL = 'https://api.r6data.com/api';

/**
 * @typedef {Object} HttpResponse
 * @property {any} data
 * @property {number} status
 * @property {Record<string, string>} headers
 */

/**
 * @typedef {Error & {
 *   response?: {
 *     status: number,
 *     data: any,
 *     headers: Record<string, string>
 *   }
 * }} HttpClientError
 */

/**
 * @param {string} url
 * @returns {boolean}
 */
function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}

/**
 * @param {string} baseURL
 * @param {string} path
 * @returns {string}
 */
function joinUrl(baseURL, path) {
  const base = String(baseURL || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${base}/${p}`;
}

/**
 * @param {string} apiKey
 * @returns {{
 *   get: (url: string) => Promise<HttpResponse>,
 *   post: (url: string, data?: any) => Promise<HttpResponse>,
 *   postForm: (url: string, formData: FormData) => Promise<HttpResponse>
 * }}
 */
function createHttpClient(apiKey) {
  /** @type {Record<string, string>} */
  const baseHeaders = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'User-Agent': `r6-data.js/${pkg.version}`,
  };

  /**
   * Perform the fetch and normalize the response (or throw an HttpClientError).
   * @param {string} method
   * @param {string} fullUrl
   * @param {Record<string, string>} headers
   * @param {string | FormData} [body]
   * @returns {Promise<HttpResponse>}
   */
  async function send(method, fullUrl, headers, body) {
    const response = await fetch(fullUrl, { method, headers, body });
    /** @type {Record<string, string>} */
    const responseHeaders = Object.fromEntries(response.headers.entries());
    const text = await response.text();

    /** @type {any} */
    let responseData = null;

    if (text) {
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }

    if (!response.ok) {
      /** @type {HttpClientError} */
      const err = new Error(`Request failed with status code ${response.status}`);
      err.response = {
        status: response.status,
        data: responseData,
        headers: responseHeaders,
      };
      throw err;
    }

    return {
      data: responseData,
      status: response.status,
      headers: responseHeaders,
    };
  }

  /**
   * @param {string} method
   * @param {string} url
   * @param {any} [data]
   * @returns {Promise<HttpResponse>}
   */
  function request(method, url, data) {
    const absolute = isAbsoluteUrl(url);
    const fullUrl = absolute ? url : joinUrl(BASE_URL, url);

    /** @type {Record<string, string>} */
    const headers = { ...baseHeaders };

    if (!absolute) {
      headers['api-key'] = apiKey;
    }

    /** @type {string | undefined} */
    let body;
    if (data !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(data);
    }

    return send(method, fullUrl, headers, body);
  }

  return {
    /**
     * @param {string} url
     * @returns {Promise<HttpResponse>}
     */
    get(url) {
      return request('GET', url);
    },

    /**
     * @param {string} url
     * @param {any} [data]
     * @returns {Promise<HttpResponse>}
     */
    post(url, data) {
      return request('POST', url, data);
    },

    /**
     * Send a multipart/form-data POST (e.g. file uploads). The Content-Type
     * header is intentionally left unset so fetch adds the multipart boundary.
     * @param {string} url
     * @param {FormData} formData
     * @returns {Promise<HttpResponse>}
     */
    postForm(url, formData) {
      const absolute = isAbsoluteUrl(url);
      const fullUrl = absolute ? url : joinUrl(BASE_URL, url);

      /** @type {Record<string, string>} */
      const headers = { ...baseHeaders };
      if (!absolute) {
        headers['api-key'] = apiKey;
      }

      return send('POST', fullUrl, headers, formData);
    },
  };
}

module.exports = createHttpClient;
