
class ThirdPartyAuth {
	constructor(props = {}) {
		this.errors = []
		this.handleError = props.reportError
	}

	loadExternalScript = (url, id) => {
		return new Promise((resolve) => {
			if (document.getElementById(id)) { return }

			const SCRIPT = 'script'
			const firstScriptTag = document.getElementsByTagName(SCRIPT)[0]
			const newScriptTag = document.createElement(SCRIPT)

			newScriptTag.id = id
			newScriptTag.src = url
			newScriptTag.async = true
			newScriptTag.defer = true

			newScriptTag.onload = () => { resolve() }

			firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag)
		})
	}

	reportError = (error) => {
		if (typeof error === 'string') {
			this.errors.push({ message: error })
		} else if (error && typeof error === 'object') {
			this.errors.push(error)
		}

		if (this.handleError) this.handleError(this.errors)
	}

	clearErrors = () => {
		this.errors = []
	}
}

export default ThirdPartyAuth
