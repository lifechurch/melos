import ThirdPartyAuth from './thirdPartyAuth'
import isTimestampExpired from '../time/isTimestampExpired'

const GOOGLE_API_URL = '//apis.google.com/js/platform.js'
const GOOGLE_SCRIPT_ID = 'google-jssdk'

/**
 * Class that provides google auth2 functionality
 * @extends ThirdPartyAuth
 */
class Google extends ThirdPartyAuth {
	/**
	 * initialize class
	 * @param  {String} client_id=null                	client id for auth2 lib
	 * @param  {String} [scope='profile email']       	scope for auth2 lib
	 * @param  {Number} [expirationBufferInSeconds=600] buffer in seconds to apply to token expiration. google token expires in 1 hour, set a 10 min buffer by default
	 *
	 */
	constructor({
		client_id = null,
		scope = 'profile email',
		expirationBufferInSeconds = 600,
	}) {
		super()
		// auth data for user populated on login and reload and returned by this.getAuthData
		this.authData = {
			token: null,
			id: null,
			givenName: null,
			familyName: null,
			isSignedIn: false,
			avatarUrl: null,
			email: null,
		}
		// init params
		this.scope = scope
		this.client_id = client_id
		this.buffer = expirationBufferInSeconds
		// init google
		this.gapi = null
		this.auth2 = null
		this.googleAuth = null
	}

	/**
	 * Load the google script and then initialize the GAPI AUTH2 lib
	 *
	 * resolve with self once script is loaded and lib is initialized.
	 * reject if any gapi calls fail, or window is undefined.
	 */
	init = () => {
		return new Promise((resolve, reject) => {
			if (typeof window !== 'undefined' && window) {
				// call method on ThirdPartyAuth class to load external script for google
				this.loadExternalScript(GOOGLE_API_URL, GOOGLE_SCRIPT_ID).then(() => {
					// Initialize auth library
					this.gapi = window.gapi
					this.gapi.load('auth2', () => {
						// Initialize GAPI Auth2 Library
						this.auth2 = this.gapi.auth2.init({
							client_id: this.clientId,
							cookiepolicy: 'single_host_origin',
							scope: this.scope
						}).then((googleAuth) => {
							this.googleAuth = googleAuth
							// set up user if already logged in
							this.setAuthData(googleAuth.currentUser.get())

							// Listen for changes to signed in state
							this.googleAuth.isSignedIn.listen((isSignedIn) => {
								this.authData.isSignedIn = isSignedIn
							})

							// Listen for changes to signed in user
							this.googleAuth.currentUser.listen(this.setAuthData)

							resolve(this)
						}, (err) => { reject(err) })
					}, (err) => { reject(err) })
				})
			} else {
				reject(new Error('Window is undefined'))
			}
		})
	}

	/**
	 * @return {Boolean} User is signed in with gapi.auth2
	 */
	isSignedIn = () => {
		return this.authData.isSignedIn
	}

	/**
	 * Sign the user in with google
	 *
	 * resolve with auth data once user signs in successfully or if user is already signed in.
	 * reject with signIn error
	 */
	signIn = () => {
		return new Promise((resolve, reject) => {
			if (
				this.authData.token === null
				|| typeof this.authData.token === 'undefined'
				|| this.authData.token.length === 0
			) {
				this.googleAuth.signIn().then((googleUser) => {
					if (googleUser && typeof googleUser === 'object') {
						const authResponse = googleUser.getAuthResponse()
						if (authResponse && typeof authResponse === 'object') {
							this.setAuthData(googleUser)
							resolve(this.getAuthData())
						} else {
							reject(new Error('Unable to sign in with Google.'))
						}
					} else {
						reject(new Error('Unable to sign in with Google.'))
					}
				}, (error) => {
					reject(error)
				})
			} else {
				resolve(this.getAuthData())
			}
		})
	}

	/**
	 * Reload the auth response to retrieve a new token
	 * This is useful to prevent an expiration from happening by checking needNewToken
	 * and then reloading before an authed api call happens
	 *
	 * resolve with new refreshed auth data.
	 * reject with reloadAuthResponse error.
	 */
	reloadAuthResponse = () => {
		return new Promise((resolve, reject) => {
			this.googleAuth.currentUser.get().reloadAuthResponse().then(() => {
				this.setAuthData(this.googleAuth.currentUser.get())
				resolve(this.getAuthData())
			}, (err) => { reject(err) })
		})
	}

	/**
	 * Calculate whether the google token's lifetime is past the allowed buffer
	 * The default check looks like this:
	 *     gwt lifetime = 1 hour
	 *     buffer time = 10 mins
	 *     timestampToCheck = gwtExpiration - buffer
	 *     is timestampToCheck in the past?
	 * @return {Boolean} We need a new gwt
	 */
	needNewToken = () => {
		const timestampToCheck = (parseInt(this.authData.expires_at, 10) / 1000) - (parseInt(this.buffer, 10))
		if (this.authData.isSignedIn && (!this.authData.token || isTimestampExpired(timestampToCheck))) {
			return true
		}
		return false
	}

	/**
	 * Set user auth data from googleAuth.currentUser
	 * called on initialization if user is already signed in, on signin and on reload
	 * @param {Object} googleUser - googleAuth.currentUser object
	 */
	setAuthData = (googleUser) => {
		if (googleUser && googleUser.isSignedIn() === true) {
			const profile = googleUser.getBasicProfile()
			this.authData.token = googleUser.getAuthResponse().id_token
			this.authData.expires_at = googleUser.getAuthResponse().expires_at
			this.authData.id = profile.getId()
			this.authData.givenName = profile.getGivenName()
			this.authData.familyName = profile.getFamilyName()
			this.authData.avatarUrl = profile.getImageUrl()
			this.authData.email = profile.getEmail()
			this.authData.isSignedIn = true
		}
	}

	/**
	 * Return the auth data for the current user
	 * @return {Object} [auth data for current user]
	 */
	getAuthData = () => {
		return this.authData
	}
}

export default Google
