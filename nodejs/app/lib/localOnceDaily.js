import LocalStore from './localStore'

/**
 * The callback needs to call handleSuccess to let localOnceDaily know that the
 * today's execution was successful, otherwise the next time localOnceDaily is
 * called it will attempt the callback again
 *
 * @callback localOnceDaily~callback
 * @param {function} handleSuccess
 */

/**
 * localOnceDaily - run any callback, but only if it hasn't been run today
 *  according to local client time. Upon successful completion of callback,
 *  a value will be stored locally to mark that this callback has been executed
 *  as of the locale year, month & day
 *
 * @param	{string}		key												A unique name used to identify this callback
 * @param	{function}	localOnceDaily~callback 	A function to execute only if it hasn't been run today
 */
export default function localOnceDaily(key, callback) {
	if (typeof callback !== 'function') {
		throw new Error('Invalid callback for localOnceDaily')
	}

	if (typeof key !== 'string') {
		throw new Error('Invalid key for localOnceDaily')
	}

	const cookieName = `LocalOnceDaily::${key}`
	const today = new Date()
	const thisRun = `${today.getFullYear().toString()}-${today.getMonth().toString()}-${today.getDate().toString()}`
	const lastRun = LocalStore.get(cookieName)

	if (thisRun !== lastRun) {
		callback(() => {
			LocalStore.set(cookieName, thisRun)
		})
	}
}
