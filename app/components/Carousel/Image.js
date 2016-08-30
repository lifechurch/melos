import React, { Component, PropTypes } from 'react'
import imageUtil from '../../lib/imageUtil'

class Image extends Component {
	render() {
		const { height, width, imageId, type, config, thumbnail, className } = this.props
		let actualWidth = width
		let actualHeight = height

		let selectedImage = {}
		if (config.images) {
			selectedImage = imageUtil(height, width, imageId, type, config, thumbnail)
		} else {
			selectedImage = {
				url: "https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg",
				width: 720,
				height: 405
			}
		}
		const selectedImage = imageUtil(height, width, imageId, type, config, thumbnail)
		return (<img className={className || ''} src={selectedImage.url} width={selectedImage.width} height={selectedImage.height} />)
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