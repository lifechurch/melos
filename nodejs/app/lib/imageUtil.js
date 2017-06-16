export default function (height, width, imageId, type, config, thumbnail) {

	// if we're getting the image from reading plan view call, then config contains the actual images instead of state.configuration
	if (type === 'about_plan') {
		if (Array.isArray(config.images)) {
			const selectedImage = config.images.reduce((lastMatch, currentSize) => {
				const currentDiff = Math.abs((currentSize.width - width) + (currentSize.height - height))
				return (currentDiff < lastMatch.diff) ? { diff: currentDiff, width: currentSize.width, height: currentSize.height, url: currentSize.url } : lastMatch
			}, { diff: width, width, height })

			return {
				url: selectedImage.url,
				width: selectedImage.width,
				height: selectedImage.height
			}
		} else {
			return {
				url: 'https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg',
				width,
				height
			}
		}

	// format is different for creating an avatar image as well
	} else if (type === 'avatar') {
		const selectedImage = config.reduce((lastMatch, currentSize) => {
			const currentDiff = Math.abs(currentSize.width - width)
			return (currentDiff < lastMatch.diff) ? { diff: currentDiff, width: currentSize.width, height: currentSize.height, url: currentSize.url } : lastMatch
		}, { diff: width, width, height })

		return {
			url: selectedImage.url,
			width: selectedImage.width,
			height: selectedImage.height
		}

	} else { // else we're getting an image data from state.configuration
		const map = (type === 'reading_plan') ? config.reading_plans : (type === 'collection') ? config.collections : null
		const sizeKey = thumbnail ? 'thumbnails' : '16x9'

		if (typeof map === 'undefined') return null;

		const actualSize = map.sizes[sizeKey].reduce((lastMatch, currentSize) => {
			const currentDiff = Math.abs(currentSize[0] - width)
			return (currentDiff < lastMatch.diff) ? { diff: currentDiff, width: currentSize[0], height: currentSize[1] } : lastMatch
		}, { diff: width, width, height })

		if (imageId == 'default') {
			var src = config.reading_plans.url.replace(/\{image_id\}/, imageId).replace(/\{0\}/, actualSize.width).replace(/\{1\}/, actualSize.height)
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


export function selectImageFromList({ images, width, height }) {
	if (!images || !width) return null

	const selectedImage = images.reduce((lastMatch, currentSize) => {
		const currentDiff = Math.abs(currentSize.width - width)
		return (currentDiff < lastMatch.diff) ?
		{
			diff: currentDiff,
			width: currentSize.width,
			height: currentSize.height,
			url: currentSize.url
		} :
			lastMatch
	}, { diff: width, width, height: height || width })

	return {
		url: selectedImage.url,
		width: selectedImage.width,
		height: selectedImage.height
	}
}

export function imgLoaded(imgElement) {
	return imgElement.complete && imgElement.naturalHeight !== 0
}

export const PLAN_DEFAULT = (
	'data:image/jpeg;base64,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'
)
