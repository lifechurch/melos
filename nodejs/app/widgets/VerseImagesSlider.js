import React, { PropTypes } from 'react'
import withLazyImages from '@youversion/api-redux/lib/endpoints/images/hocs/withLazyImages'
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
	imgHeight: PropTypes.number,
	imgWidth: PropTypes.number,
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
