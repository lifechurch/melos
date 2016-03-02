import React, { Component, PropTypes } from 'react'

class Image extends Component {
	render() {
		const { images, height, width } = this.props

		var image = []

		if (images) {
			image = images.filter((i) => { if (i.width==width && i.height==height) { return true } })
		}

		image = image.length ? <img src={image[0].url} /> : null

		return image
	}
}

Image.propTypes = {
	images: PropTypes.array.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired
}

export default Image
