export default function(height, width, imageId, type, config, thumbnail) {

	// if we're getting the image from reading plan view call, then config contains the actual images instead of state.configuration
	if (type === 'about_plan') {
		if (Array.isArray(config.images)) {
			const selectedImage = config.images.reduce((lastMatch, currentSize) => {
				const currentDiff = Math.abs( (currentSize.width - width) + (currentSize.height - height) )
				return (currentDiff < lastMatch.diff) ? { diff: currentDiff, width: currentSize.width, height: currentSize.height, url: currentSize.url } : lastMatch
			}, { diff: width, width: width, height: height })

			return {
				url: selectedImage.url,
				width: selectedImage.width,
				height: selectedImage.height
			}
		} else {
			return {
				url: "https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg",
				width,
				height
			}
		}

	// format is different for creating an avatar image as well
	} else if (type === 'avatar') {
		const selectedImage = config.reduce((lastMatch, currentSize) => {
			const currentDiff = Math.abs(currentSize.width - width)
			return (currentDiff < lastMatch.diff) ? { diff: currentDiff, width: currentSize.width, height: currentSize.height, url: currentSize.url } : lastMatch
		}, { diff: width, width: width, height: height })

		return {
			url: selectedImage.url,
			width: selectedImage.width,
			height: selectedImage.height
		}

	} else { // else we're getting an image data from state.configuration
		const map = (type === 'reading_plan') ? config['reading_plans'] : (type === 'collection') ? config['collections'] : null
		const sizeKey = thumbnail ? 'thumbnails' : '16x9'

		if (typeof map === 'undefined') return null;

		const actualSize = map.sizes[sizeKey].reduce((lastMatch, currentSize) => {
			const currentDiff = Math.abs(currentSize[0] - width)
			return (currentDiff < lastMatch.diff) ? { diff: currentDiff, width: currentSize[0], height: currentSize[1] } : lastMatch
		}, { diff: width, width: width, height: height })

		if (imageId == 'default') {
			var src = config['reading_plans'].url.replace(/\{image_id\}/, imageId).replace(/\{0\}/, actualSize.width).replace(/\{1\}/, actualSize.height)
		} else {
			var src = map.url.replace(/\{image_id\}/, imageId).replace(/\{0\}/, actualSize.width).replace(/\{1\}/, actualSize.height)
		}

		return {
			url: src,
			width: actualSize.width,
			height: actualSize.height
		}
	}
}