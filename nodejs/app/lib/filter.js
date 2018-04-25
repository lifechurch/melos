const DB_NAME = 'Bible.com'
export default {

	/**
	 * Create/Update an IndexedDB Store with indices
	 * @storeName {string} - name of store
	 * @indices {Array} - array of field names
	 */
	build(storeName, indices) {
		if (typeof window.yvIndex === 'undefined') {
			window.yvIndex = { databases: { [DB_NAME]: { stores: {} } } }
		}

		const db = window.yvIndex.databases[DB_NAME]

		if (typeof db.stores[storeName] === 'undefined') {
			db.stores[storeName] = { indices: [], searchIndex: {}, searchKeys: [] }
		}

		db.stores[storeName].indices = db.stores[storeName].indices.concat(indices)
	},

	/**
	 * Remove all values from store
	 */
	clear(storeName) {
		if (typeof window.yvIndex === 'object') {
			const db = window.yvIndex.databases[DB_NAME]
			if (typeof db.stores[storeName] === 'object') {
				db.stores[storeName] = Object.assign({}, db.stores[storeName], { searchIndex: {}, searchKeys: [] })
			}
		}

	},

	/**
	 * Add values to index
	 * @storeName {string} - name of store
	 * @values {Array} - array of objects
	 */
	add(storeName, values) {
		if (typeof values !== 'undefined' && Array.isArray(values) && values.length > 0) {
			try {
				const store = window.yvIndex.databases[DB_NAME].stores[storeName]
				store.values = values.slice(0)
				for (let index = 0; index < store.values.length; index++) {
					const value = store.values[index]
					for (const indexField of store.indices) {
						store.searchIndex[value[indexField]] = index
					}
				}
				store.searchKeys = Object.keys(store.searchIndex)
			} catch (ex) { }
		}
	},

	/**
	 * Filter array of objects by filter string
	 * @storeName {string} - name of store
	 * @filter {string} - string
	 */
	filter(storeName, filter) {
		if (typeof filter === 'undefined' || filter == '') {
			return []
		} else {
			filter = filter.toLocaleUpperCase()
			const results = []
			try {
				const store = window.yvIndex.databases[DB_NAME].stores[storeName]
				for (let x = 0; x < store.searchKeys.length; x++) {
					const key = store.searchKeys[x]
					if (key.toLocaleUpperCase().indexOf(filter) !== -1) {
						const matchedIndex = store.searchIndex[key]
						const matchedItem = store.values[matchedIndex]
						if (results.indexOf(matchedItem) == -1) {
							results.push(matchedItem)
						}
					}
				}
			} catch (ex) {}
			return results
		}
	}
}