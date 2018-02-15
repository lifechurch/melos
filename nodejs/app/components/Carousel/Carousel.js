import React from 'react'
import PropTypes from 'prop-types'
import CarouselBanner from './CarouselBanner'
import CarouselGradient from './CarouselGradient'
import CarouselTitle from './CarouselTitle'
import CarouselStandard from './CarouselStandard'

function Carousel(props) {
	const { carouselContent, carouselType, imageConfig, localizedLink, isRtl } = props

	let carousel = null
	switch (carouselType) {
		case 'banner':
			carousel = (
				<CarouselBanner
					carouselContent={carouselContent}
					imageConfig={imageConfig}
					localizedLink={localizedLink}
					isRtl={isRtl}
				/>
			)
			break

		case 'gradient':
			carousel = (
				<CarouselGradient
					carouselContent={carouselContent}
					imageConfig={imageConfig}
					localizedLink={localizedLink}
					isRtl={isRtl}
				/>
			)
			break

		case 'title':
			carousel = (
				<CarouselTitle
					carouselContent={carouselContent}
					imageConfig={imageConfig}
					localizedLink={localizedLink}
					isRtl={isRtl}
				/>
			)
			break

		case 'standard':
			carousel = (
				<CarouselStandard
					carouselContent={carouselContent}
					context={carouselContent.type}
					imageConfig={imageConfig}
					localizedLink={localizedLink}
					isRtl={isRtl}
				/>
			)
			break

		default:
			break
	}

	return (
		<div>{ carousel }</div>
	)

}

Carousel.propTypes = {
	carouselContent: PropTypes.object.isRequired,
	imageConfig: PropTypes.object.isRequired,
	carouselType: PropTypes.string.isRequired,
	localizedLink: PropTypes.func.isRequired,
	isRtl: PropTypes.func.isRequired,
}

export default Carousel
