import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'


class Carousel extends Component {
    render() {
			const { carouselContent, carouselType, carouselSettings } = this.props

			var settings = {}
			switch (carouselType) {

				case 'banner':
			    settings = {
			      className: 'center',
			      centerMode: true,
			      infinite: false,
			      centerPadding: '60px',
			      slidesToShow: 3,
			      initialSlide: 3,
			      speed: 500
			    };

					break


				case 'custom':
					if(carouselSettings) {
						settings = carouselSettings
					}
					// if custom selected but no settings given just go to default?
					console.log("no settings given for custom carousel. reverting to default")
					// break


				case 'title':
				case 'standard':
				case 'gradient':
				default:
			    settings = {
			      className: 'center',
			      centerMode: false,
			      infinite: false,
			      centerPadding: '60px',
			      slidesToShow: 3,
			      initialSlide: 3,
			      speed: 500
			    };

			}



	    var slides = carouselContent[0].items.map( function(slide, index) {
	    	return <CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} key={slide.id} />
	    })

	    var classes = `carousel-${carouselType} content`

	    return (
	      <div className={classes} >
	        <Slider {...settings}>
	        	{slides}
	        </Slider>
	      </div>
	    );

		}

}

export default Carousel
