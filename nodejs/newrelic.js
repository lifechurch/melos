/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */

 const nodeEnv = process.env.NODE_ENV || 'Unspecified'

 exports.config = {
  /**
   * Array of application names.
	 * The ENV var NEW_RELIC_APP_NAME takes precendence
	 *  and it is set in the nginx config, but it will
	 *  default to this value if that is not set
   */
   app_name: [ `Bible.com Node.js ${nodeEnv}`, `Bible.com ${nodeEnv}` ],
  /**
   * Your New Relic license key.
   */
   license_key: process.env.NEW_RELIC_LICENSE_KEY,
   logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
     level: 'info'
   }
 }
