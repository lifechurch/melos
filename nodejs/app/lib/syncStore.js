import LocalStore from '@youversion/utils/lib/localStore'

/**
 * Helps keep an array of items stored on a client in sync with a server list
 */
class SyncStore {

	/**
	 * @param {string} storeKey - the key used to reference this list in the local store
	 * @param {integer} max - the maximum number of items allowed in this list
	 */
	constructor(storeKey, max = 5) {
		this.DATE_MIN = new Date(0)
		this.storeKey = storeKey
		this.max = max

		const store = LocalStore.get(this.storeKey) || {}

		this.data = store.data || []
		this.meta = store.meta || {}
		this.syncDate = store.syncDate || this.DATE_MIN
		if (typeof store.changedDate === 'string') {
			this.changedDate = new Date(Date.parse(store.changedDate))
		} else if (store.changedDate instanceof Date) {
			this.changedDate = store.changedDate
		} else {
			this.changedDate = this.DATE_MIN
		}
	}

	/**
	 * Save the current instance data to local store and update changedDate
	 * @param {date} changedDate - [optional] if passed, sets last changed date to this value
	 *   handy if you are syncing with a server based on last sync time. You want the last sync
	 *   local time to equal the last sync time on the client, so pass the value of last-server-sync-time
	 *   to changedDate here
	 */
	save(changedDate = new Date(), updateServer = true) {
		this.changedDate = changedDate
		LocalStore.set(this.storeKey, {
			data: this.data,
			meta: this.meta,
			syncDate: this.syncDate,
			changedDate: this.changedDate
		})

		if (updateServer) {
			this.updateServer()
		}
	}

	/**
	 * Add an item to the local list and notify server of change
	 * @param {any} value - the actual value stored in the list
	 * @param {object} meta - [optional] metadata associated with value
	 */
	add(value, meta = null) {
		const index = this.data.indexOf(value)

		if (index === -1) {
			this.data.push(value)
		} else {
			this.data.push(this.data.splice(index, 1)[0])
		}

		if (typeof meta !== 'undefined') {
			this.meta[value] = meta
		}

		if (this.data.length > this.max) {
			this.data.slice(0, this.data.length - this.max).forEach((val) => {
				delete this.meta[val]
			})
			this.data = this.data.slice(-1 * this.max)
		}

		this.save()
	}

	/**
	 * Remove an item from the local list and notify server of change
	 * @param {any} value - the value to remove
	 */
	remove(value) {
		const index = this.data.indexOf(value)
		if (index > -1) {
			this.data.splice(index, 1)
			LocalStore.set(this.storeKey, this.data)
		}
		delete this.meta[value]
		this.save()
	}

	/**
	 * Get the list of items or metadata associated with list
	 * @param {boolean} meta - IF TRUE, return list of metadata, ELSE return just list of items
	 */
	get(meta = false) {
		if (meta) {
			return this.data.map((value) => {
				return this.meta[value] || {}
			})
		} else {
			return this.data
		}
	}

	/**
	 * Register a callback that gets fired when server needs to update its value
	 * @param {function} updateCallback - the function that needs to be fired to update server
	 *  The function will get a single parameter containing the current local list with no metadata
	 */
	onUpdate(updateCallback) {
		if (typeof updateCallback === 'function') {
			this.updateCallback = updateCallback
		}
	}

	/**
	 * Attempt to call the update callback if it exists, passing the current list of data
	 */
	updateServer() {
		if (typeof this.updateCallback === 'function') {
			this.updateCallback(this.data)
		}
	}

	/**
	 * Update the local list, either to initialize value or because server has more recent list
	 * @param {object} data - the new list of data, it will override current local list
	 * @param {date} syncDate - the date from the server (or initialization date) when this data was last synced
	 */
	updateClient(data, syncDate) {
		this.data = data
		this.syncDate = syncDate
		const changedDate = syncDate
		this.save(changedDate, false)
	}

	/**
	 * Compares sync date with local sync date to see if client or server needs to update
	 *  and then calls updateClient() or updateServer() accordingly
	 * @param {object} data - the external list of data that will be used if server is newer
	 * @param {date} syncDate - the date used to compare to this.syncDate to determine which list is newer
	 */
	sync(data, syncDate) {
		// Server version is newer
		if (syncDate.getTime() > this.changedDate.getTime()) {
			this.updateClient(data, syncDate)

		// Client version is newer
		} else if (syncDate.getTime() < this.changedDate.getTime()) {
			this.updateServer()

		}
	}
}

export default SyncStore
