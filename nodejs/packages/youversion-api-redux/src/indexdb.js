import idb from 'idb'

const DB_NAME = 'YouVersion'
const VERSION = 1

// schemas



// database functions
const createStore = (upgradeDB, storeName, options) => {
	if (!upgradeDB.objectStoreNames.contains(storeName)) {
		upgradeDB.createObjectStore(storeName, options);
	}
}

const dbPromise = idb.open(DB_NAME, VERSION, (upgradeDB) => {
	// upgradeCallback is called if version is greater than the version last opened
	createStore(upgradeDB, 'plans', { keyPath: 'id' })
})


const database = {
	get({ storeName, key }) {
		return dbPromise.then((db) => {
			return db.transaction(storeName)
        .objectStore(storeName).get(key)
		})
	},
	set({ storeName, key = null, val }) {
		return dbPromise.then((db) => {
			const tx = db.transaction(storeName, 'readwrite')
			tx.objectStore(storeName).put(val, key)
			return tx.complete
		})
	},
	delete({ storeName, key }) {
		return dbPromise.then((db) => {
			const tx = db.transaction(storeName, 'readwrite')
			tx.objectStore(storeName).delete(key)
			return tx.complete
		})
	},
	clear({ storeName }) {
		return dbPromise.then((db) => {
			const tx = db.transaction(storeName, 'readwrite')
			tx.objectStore(storeName).clear()
			return tx.complete
		})
	},
	keys({ storeName }) {
		return dbPromise.then((db) => {
			const tx = db.transaction(storeName)
			const keys = []
			tx.objectStore(storeName).openCursor().then((cursor) => {
				if (!cursor) return
				keys.push(cursor.key)
				cursor.continue()
			})

			return tx.complete.then(() => { return keys })
		})
	}
}

export default database
