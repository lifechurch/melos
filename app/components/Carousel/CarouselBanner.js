import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import Image from './Image'
import CarouselArrow from './CarouselArrow'


class CarouselBanner extends Component {
  render() {
		const { carouselContent, imageConfig } = this.props

    var settings = {
      centerMode: true,
      infinite: true,
      variableWidth: true,
      initialSlide: 3,
      arrows: true,
      prevArrow: <CarouselArrow dir='left' width='30' height='30' backColor='black'/>,
      nextArrow: <CarouselArrow dir='right' width='30' height='30' backColor='black'/>,
      responsive: [ {
      	breakpoint: 768, settings: { slidesToShow: 1 }
      }, {
      	breakpoint: 1024, settings: { slidesToShow: 3 }
      } ]
    };

    // for banner carousels, we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
    var slides = carouselContent.items.map( function(slide, index) {
    	if (slide.image_id) {
				return (
					<div className=''>
						<CarouselSlideImage key={`${carouselContent.id}-${index}`}>
    					<Image width={720} height={405} thumbnail={false} imageId={slide.image_id} type={slide.type} config={imageConfig} />
    				</CarouselSlideImage>
					</div>
				)
			} else if (slide.gradient) {
				return <div className=''><CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} key={`${carouselContent.id}-${index}`}/></div>
			} else {
				return (
					<div className=''>
						<CarouselSlideImage key={`${carouselContent.id}-${index}`}>
    					<Image width={720} height={405} thumbnail={false} imageId='default' type={slide.type} config={imageConfig} />
    				</CarouselSlideImage>
					</div>
				)
			}
    })


    var classes = `carousel-banner`

	  return (
	    <div className={classes} >
	      <Slider {...settings}>
	      	{slides}
	      </Slider>
	    </div>
	  );
	}
}


export default CarouselBanner
