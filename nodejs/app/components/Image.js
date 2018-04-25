import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Image extends Component {
	render() {
		const { images, height, width, className } = this.props

		let image = []

		if (images) {
			image = images.filter((i) => { if (i.width == width && i.height == height) { return true } })
		}

		image = image.length ? <img src={image[0].url} className={className} /> : null

		return image
	}
}

Image.propTypes = {
	images: PropTypes.array.isRequired,
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired
}

export default Image
