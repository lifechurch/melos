import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import Image from './Image'
import CarouselArrow from './CarouselArrow'


class CarouselStandard extends Component {
  render() {
		const { carouselContent, imageConfig } = this.props

    var settings = {
    	centerMode: false,
      infinite: true,
      variableWidth: true,
      arrows: true,
      prevArrow: <CarouselArrow dir='left' fill='gray' width={25} height={25}/>,
      nextArrow: <CarouselArrow dir='right' fill='gray' width={25} height={25}/>,
      responsive: [ {
      	breakpoint: 524, settings: { arrows: false }
      } ]
    };

    // for banner carousels, we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
    var slides = carouselContent.items.map( function(slide, index) {
    	if (slide.image_id) {
				return (
					<div className='radius-5'>
						<CarouselSlideImage title={slide.title} key={`${carouselContent.id}-${index}`}>
    					<Image width={320} height={180} thumbnail={false} imageId={slide.image_id} type={slide.type} config={imageConfig} />
    				</CarouselSlideImage>
					</div>
				)
			} else if (slide.gradient) {
				return <div className='radius-5'><CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} key={`${carouselContent.id}-${index}`}/></div>
			} else {
				<CarouselSlideImage title={slide.title} key={`${carouselContent.id}-${index}`}>
					<Image width={320} height={180} thumbnail={false} imageId='default' type={slide.type} config={imageConfig} />
				</CarouselSlideImage>
			}
    })


    var classes = `carousel-standard`

	  return (
	    <div className={classes} >
	    	<div className='header'><a href='#'>{`${carouselContent.title} >`}</a></div>
	    	<div className=''>
		      <Slider {...settings}>
		      	{slides}
		      </Slider>
	      </div>
	    </div>
	  );
	}
}


export default CarouselStandard
