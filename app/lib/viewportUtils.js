/**
 * determine if user is using a touchscreen
 *
 */
export default class viewportUtils {

	constructor() {
		this.isUsingTouchScreen = false

		if (typeof window !== 'undefined') {
			window.addEventListener('touchstart', () => {
				this.isUsingTouchScreen = true
			})
		}
	}

	isUsingTouchScreen() {
		return this.isUsingTouchScreen
	}
}