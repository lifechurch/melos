export default function getNewSize({ defaultHeight, defaultWidth, newHeight, newWidth }) {
	let finalHeight, finalWidth

	if (typeof newHeight !== 'undefined') {
		const aspectRatio = defaultWidth / defaultHeight
		finalHeight = newHeight
		finalWidth = finalHeight * aspectRatio
	} else {
		const aspectRatio = defaultWidth / defaultHeight
		finalWidth = newWidth
		finalHeight = newWidth * aspectRatio
	}

	return {
		height: Math.floor(finalHeight),
		width: Math.floor(finalWidth)
	}
}
