/**
 * Build a URL path with query-string parameters.
 *
 * @param {string} basePath
 * @param {Record<string, string | number | boolean | undefined | null>} [paramsObj={}]
 * @returns {string}
 */
function buildUrlAndParams(basePath, paramsObj = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(paramsObj)) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  }

  const query = params.toString();
  return `${basePath}${query ? `?${query}` : ''}`;
}

module.exports = buildUrlAndParams;
