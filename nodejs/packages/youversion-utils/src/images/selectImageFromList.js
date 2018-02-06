export default function selectImageFromList({ images, width, height }) {
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
