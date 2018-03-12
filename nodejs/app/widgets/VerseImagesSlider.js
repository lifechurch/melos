import React from 'react'
import PropTypes from 'prop-types'
import withLazyImages from '../components/images/hocs/withLazyImages'
import Slider from '../components/Slider'


function VerseImagesSlider(props) {
	const { images, children } = props

	if (!images || (images.length === 0)) return null
	return (
		<Slider>{ children }</Slider>
	)
}

/* eslint-disable react/no-unused-prop-types */
VerseImagesSlider.propTypes = {
	images: PropTypes.array,
	imgHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	imgWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	hiRes: PropTypes.bool,
	children: PropTypes.any,
}

VerseImagesSlider.defaultProps = {
	images: null,
	imgHeight: 320,
	imgWidth: 320,
	hiRes: true,
	children: null,
}

export default withLazyImages(VerseImagesSlider)
