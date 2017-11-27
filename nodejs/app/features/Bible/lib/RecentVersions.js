import Immutable from 'immutable'
import LocalStore from '@youversion/utils/lib/localStore'
import SyncStore from '../../../lib/syncStore'

/**
 * Class representing list of recently used Bible versions
 * @extends SyncStore
 */
class RecentVersions extends SyncStore {

	constructor() {
		super('RecentVersions', 5)
	}

	/**
	 * Check list of recent versions from external (api) and
	 *  compare to list store locally on the client.
	 *  IF server list is newer, update client store
	 *  IF client list is newer, call updateServer() which fires
	 *   callback to update server via API call
	 *
	 * @param {object} userSettings - the result of users/view_settings api call
	 *  See {@link http://developers.youversion.com/api/docs/3.1/sections/users/update_settings.html}
	 */
	syncVersions(userSettings = {}) {
		const settings = Immutable.fromJS(userSettings)
		let versions = settings.getIn(['settings', 'bible', 'recent_versions']) || []
		if (typeof versions.toJS === 'function') {
			versions = versions.toJS()
		}

		let syncDate = this.DATE_MIN
		if (typeof settings.get('updated_dt') === 'string') {
			try {
				syncDate = new Date(Date.parse(settings.get('updated_dt')))
			} catch (e) {}
		}

		this.sync(versions, syncDate)
	}

	/**
	 * Add a version to the local list of recently used versions
	 *  and then call updateServer() which fires callback to update
	 *  server via API call
	 *
	 * @param {object} - a version object from bible/version api call
	 *  See {@link http://developers.youversion.com/api/docs/3.1/sections/bible/version.html}
	 */
	addVersion(version) {
		let { id, abbreviation, title, local_title, local_abbreviation } = version
		title = local_title || title
		abbreviation = local_abbreviation || abbreviation
		if (typeof id !== undefined && id) {
 			this.add(id, { id, abbreviation, title })
 		}
	}

	/**
	 * gets version objects for each of the recent versions, from a complete versions
	 * list passed in as a param
	 *
	 * @param      {object}  versionsList  Object of version objects
	 */
	getVersions(versionsList) {
		const recentVersions = LocalStore.get('RecentVersions') ? LocalStore.get('RecentVersions').data : null
		const versionsInfo = {}

		if (Array.isArray(recentVersions) && recentVersions.length > 0) {
			recentVersions.forEach((id) => {
				if (id in versionsList) {
					versionsInfo[id] = versionsList[id]
				}
			})
		}

		return versionsInfo
	}

	/**
	 * Calls the onUpdate callback of the SyncStore class that the consumer
	 *  must register with a call to onUpdate(). It formats the local list
	 *  of recently used versions into a format compatible with the
	 *  users/update_settings api call
	 *  See {@link http://developers.youversion.com/api/docs/3.1/sections/users/update_settings.html}
	 *
	 * @override
	 */
	updateServer() {
		if (typeof this.updateCallback === 'function') {
			this.updateCallback(Immutable.fromJS({}).setIn(['settings', 'bible', 'recent_versions'], this.data).toJS())
		}
	}
}

export default RecentVersions
