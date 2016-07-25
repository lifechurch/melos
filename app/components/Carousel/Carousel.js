import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselBanner from './CarouselBanner'
import CarouselGradient from './CarouselGradient'
import CarouselTitle from './CarouselTitle'
import CarouselStandard from './CarouselStandard'



class Carousel extends Component {
    render() {
			const { carouselContent, carouselType, carouselSettings, imageConfig } = this.props

			var carousel = null
			switch (carouselType) {

				case 'banner':
					carousel = <CarouselBanner carouselContent={carouselContent} imageConfig={imageConfig}/>

					break

				case 'gradient':
					carousel = <CarouselGradient carouselContent={carouselContent} imageConfig={imageConfig}/>

					break

				case 'title':
					carousel = <CarouselTitle carouselContent={carouselContent} imageConfig={imageConfig}/>

					break

				case 'standard':
					carousel = <CarouselStandard carouselContent={carouselContent} imageConfig={imageConfig}/>

					break


				default:

			}

	    return (
	    	<div>{carousel}</div>
	    );

		}

}


export default Carousel
