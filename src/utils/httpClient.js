const pkg = require('../../package.json');

const DEFAULT_BASE_URL = 'https://public-api.arenyze.com/r6/api';

const DEFAULT_SITE_BASE_URL = 'https://r6.arenyze.com/api';

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
 * @param {string} [baseUrl]
 * @param {string} [siteBaseUrl]
 * @returns {{
 *   get: (url: string) => Promise<HttpResponse>,
 *   post: (url: string, data?: any) => Promise<HttpResponse>,
 *   postForm: (url: string, formData: FormData) => Promise<HttpResponse>,
 *   getSite: (url: string) => Promise<HttpResponse>,
 *   postFormSite: (url: string, formData: FormData) => Promise<HttpResponse>
 * }}
 */
function createHttpClient(apiKey, baseUrl, siteBaseUrl) {
  const BASE_URL = String(baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
  const SITE_BASE_URL = String(siteBaseUrl || DEFAULT_SITE_BASE_URL).replace(/\/+$/, '');

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
   * @param {string} [base]
   * @returns {Promise<HttpResponse>}
   */
  function request(method, url, data, base) {
    const absolute = isAbsoluteUrl(url);
    const fullUrl = absolute ? url : joinUrl(base || BASE_URL, url);

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

  /**
   * @param {string} url
   * @param {FormData} formData
   * @param {string} base
   * @returns {Promise<HttpResponse>}
   */
  function sendForm(url, formData, base) {
    const absolute = isAbsoluteUrl(url);
    const fullUrl = absolute ? url : joinUrl(base, url);

    /** @type {Record<string, string>} */
    const headers = { ...baseHeaders };
    if (!absolute) {
      headers['api-key'] = apiKey;
    }

    return send('POST', fullUrl, headers, formData);
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
      return sendForm(url, formData, BASE_URL);
    },

    /**
     * @param {string} url
     * @returns {Promise<HttpResponse>}
     */
    getSite(url) {
      return request('GET', url, undefined, SITE_BASE_URL);
    },

    /**
     * @param {string} url
     * @param {FormData} formData
     * @returns {Promise<HttpResponse>}
     */
    postFormSite(url, formData) {
      return sendForm(url, formData, SITE_BASE_URL);
    },
  };
}

module.exports = createHttpClient;
