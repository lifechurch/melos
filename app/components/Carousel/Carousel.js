import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselBanner from './CarouselBanner'
import CarouselGradient from './CarouselGradient'
import CarouselTitle from './CarouselTitle'
import CarouselStandard from './CarouselStandard'


class Carousel extends Component {
    render() {
			const { carouselContent, carouselType, carouselSettings } = this.props

			var carousel = {}
			switch (carouselType) {

				case 'banner':
					carousel = <CarouselBanner carouselContent={carouselContent}/>

					break

				case 'gradient':
					carousel = <CarouselGradient carouselContent={carouselContent}/>

					break

				case 'title':
					carousel = <CarouselTitle carouselContent={carouselContent}/>

					break

				case 'standard':
					carousel = <CarouselStandard carouselContent={carouselContent}/>

					break

				case 'custom':
					carousel = <CarouselCustom carouselContent={carouselContent} settings={carouselSettings}/>

					break


				default:


			}
	    // var classes = `carousel-${carouselType}`


	    return (
	    	<div>{carousel}</div>
	    );

		}

}


export default Carousel
