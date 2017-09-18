/**
 *
 *
 */
export default class viewportUtils {

	constructor() {
		return this
	}

	/**
	 * addEventListener to the window object
	 *
	 * @param      {string}    eventListener  The event listener name
	 * @param      {Function}  callback       The callback function
	 */
	registerListener(eventListener, callback) {
		const eventKey = `did_${eventListener}`

		window.addEventListener(eventListener, () => {
			this[eventKey] = true
		})

		setInterval(() => {
			if (this[eventKey]) {
				this[eventKey] = false
				callback(this.getViewport())
			}
		}, 100)

		callback(this.getViewport())
	}

	/**
	 * instead of doing this in the constructor, we'll do it explicitly so we don't have to
	 * wastefully add a listener (there is also a warning in chrome wanting to set a passive attr
	 * on the listener to improve scrolling performance, but it's currently not cross-browser supported - jan.22.17)
	 */
	initIsUsingTouchScreen = () => {
		this.isUsingTouchScreen = false

		this.registerListener('touchstart', () => {
			if (!this.isUsingTouchScreen) {
				this.isUsingTouchScreen = true
			}
		})
	}

	/**
	 * Determines if using touch screen.
	 *
	 * @return     {boolean}  True if using touch screen, False otherwise.
	 */
	isUsingTouchScreen = () => {
		if (typeof this.isUsingTouchScreen !== 'undefined') {
			return this.isUsingTouchScreen
		} else {
			console.log('Please initialize this functionality with initIsUsingTouchScreen')
			return null
		}
	}

	/**
	 * Gets the viewport dimensions
	 *
	 * @return     {Object}  The viewport height and width
	 */
	getViewport = () => {
		if (typeof window === 'undefined') {
			return null
		}

		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight

		return { height: viewportHeight, width: viewportWidth }
	}

	/**
	 * Gets the element dimensions/position
	 *
	 * @param      {DOMNode}  element  The element
	 * @return     {Object}  The element's dimenstions/position
	 */
	getElement = (element) => {
		if (typeof window === 'undefined') {
			return null
		}

		// DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
		return element ? element.getBoundingClientRect() : {}
	}


}
