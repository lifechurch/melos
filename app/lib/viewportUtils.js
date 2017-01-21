/**
 * determine if user is using a touchscreen
 *
 */
export default class viewportUtils {

	constructor() {
		this.isUsingTouchScreen = false

		this.registerListener('touchstart', () => {
			if (!this.isUsingTouchScreen) {
				this.isUsingTouchScreen = true
			}
		})
	}

	/**
	 * addEventListener to the window object
	 *
	 * @param      {string}    eventListener  The event listener string
	 * @param      {Function}  callback       The callback function
	 */
	registerListener(eventListener, callback) {
		if (typeof window !== 'undefined') {
			window.addEventListener(eventListener, callback)
		}
	}

	/**
	 * Determines if using touch screen.
	 *
	 * @return     {boolean}  True if using touch screen, False otherwise.
	 */
	isUsingTouchScreen() {
		return this.isUsingTouchScreen
	}

	/**
	 * Gets the viewport dimensions
	 *
	 * @return     {Object}  The viewport height and width
	 */
	getViewport() {
		if (typeof window == 'undefined') {
			return null
		}

		let viewportWidth = window.innerWidth
		let viewportHeight = window.innerHeight

		return { height: viewportHeight, width: viewportWidth }
	}

	/**
	 * Gets the element dimensions/position
	 *
	 * @param      {DOMNode}  element  The element
	 * @return     {Object}  The element's dimenstions/position
	 */
	getElement(element) {
		if (typeof window == 'undefined') {
			return null
		}

		// rect is a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
		return element.getBoundingClientRect()
	}


}