import React, { Component, PropTypes } from 'react'

class Image extends Component {
	render() {
		const { height, width, imageId, type, config, thumbnail } = this.props
		const map = (type === 'reading_plan') ? config['reading_plans'] : (type === 'collection') ? config['collections'] : null
		const sizeKey = thumbnail ? 'thumbnails' : '16x9'

		if (typeof map === 'undefined') return null;

		let actualWidth = width
		let actualHeight = height

		const actualSize = map.sizes[sizeKey].reduce((lastMatch, currentSize) => {
			const currentDiff = Math.abs(currentSize[0] - width)
			return (currentDiff < lastMatch.diff) ? { diff: currentDiff, width: currentSize[0], height: currentSize[1] } : lastMatch
		}, { diff: width, width: width, height: height })

		const src = map.url.replace(/\{image_id\}/, imageId).replace(/\{0\}/, actualSize.width).replace(/\{1\}/, actualSize.height)

		return (<img src={src} width={actualSize.width} height={actualSize.height} />)
	}
}

Image.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	imageId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
	type: PropTypes.string.isRequired,
	config: PropTypes.object.isRequired,
	thumbnail: PropTypes.bool.isRequired
}

export default Image