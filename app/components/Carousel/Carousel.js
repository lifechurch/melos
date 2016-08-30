import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselBanner from './CarouselBanner'
import CarouselGradient from './CarouselGradient'
import CarouselTitle from './CarouselTitle'
import CarouselStandard from './CarouselStandard'

class Carousel extends Component {
    render() {
			const { carouselContent, carouselType, carouselSettings, imageConfig, localizedLink, isRtl } = this.props

			var carousel = null
			switch (carouselType) {

				case 'banner':
					carousel = <CarouselBanner carouselContent={carouselContent} imageConfig={imageConfig} localizedLink={localizedLink} isRtl={isRtl} />
					break

				case 'gradient':
					carousel = <CarouselGradient carouselContent={carouselContent} imageConfig={imageConfig} localizedLink={localizedLink} isRtl={isRtl} />
					break

				case 'title':
					carousel = <CarouselTitle carouselContent={carouselContent} imageConfig={imageConfig} localizedLink={localizedLink} isRtl={isRtl} />
					break

				case 'standard':
					carousel = <CarouselStandard carouselContent={carouselContent} context={carouselContent.type} imageConfig={imageConfig} localizedLink={localizedLink} isRtl={isRtl} />
					break

				default:
					break
			}

	    return (<div>{carousel}</div>);
		}

}


export default Carousel
