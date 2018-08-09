'use strict'

const licenseKey = process.env.NEW_RELIC_LICENSE_KEY
const appName = process.env.APP_NAME || 'Bible.com: Elaphros: Unspecified'
/**
 * New Relic agent configuration.
 *
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: [ appName ],
  /**
   * Your New Relic license key.
   */
  license_key: licenseKey,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  },
  /**
   * When true, all request headers except for those listed in attributes.exclude
   * will be captured for all traces, unless otherwise specified in a destination's
   * attributes include/exclude lists.
   */
  allow_all_headers: true,
  attributes: {
    /**
     * Prefix of attributes to exclude from all destinations. Allows * as wildcard
     * at end.
     *
     * NOTE: If excluding headers, they must be in camelCase form to be filtered.
     *
     * @env NEW_RELIC_ATTRIBUTES_EXCLUDE
     */
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },
  rules: {
    name: [
      {
        pattern: "/bible-offline",
        name: "bible-offline"
      },
      {
        pattern: "\/bible\/[0-9]+\/[^\.]+\.[0-9]+\.[0-9]+.*$",
        name: "bible-verse"
      },
      {
        pattern: "\/bible\/[0-9]+\/[^\.]+\.[0-9]+$",
        name: "bible-chapter"
      },
      {
        pattern: "\/json\/bible\/books\/.+\/chapters$",
        name: "json-bible-chapters"
      },
      {
        pattern: "\/json\/bible\/books\/[^\/]+$",
        name: "json-bible-books"
      },
      {
        pattern: "\/json\/bible\/versions\/[^\/]+$",
        name: "json-bible-versions"
      },
      {
        pattern: "\/json\/bible\/languages$",
        name: "json-bible-languages"
      },
      {
        pattern: "\/json\/app\/locales$",
        name: "json-app-locales"
      },
      {
        pattern: "\/ping$",
        name: "k8s-liveness-probe"
      },
      {
        pattern: "\/static-assets\/.+$",
        name: "static-assets"
      }
    ]
  }
}
