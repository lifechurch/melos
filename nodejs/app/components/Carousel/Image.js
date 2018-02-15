import React from 'react'
import PropTypes from 'prop-types'
import imageUtil from '../../lib/imageUtil'

function Image(props) {
	const { height, width, imageId, type, config, thumbnail, className, alt } = props
	const selectedImage = imageUtil(height, width, imageId, type, config, thumbnail)
	return (<img alt={alt} className={className || ''} src={selectedImage.url} width={selectedImage.width} height={selectedImage.height} />)
}

Image.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
	imageId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
	type: PropTypes.string.isRequired,
	config: PropTypes.object.isRequired,
	thumbnail: PropTypes.bool,
	className: PropTypes.string,
	alt: PropTypes.string
}

Image.defaultProps = {
	thumbnail: true,
	className: '',
	alt: ''
}

export default Image