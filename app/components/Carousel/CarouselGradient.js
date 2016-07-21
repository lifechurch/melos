import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import CarouselArrow from './CarouselArrow'


class CarouselGradient extends Component {
  render() {
		const { carouselContent } = this.props

    var settings = {
      centerMode: false,
      infinite: true,
      variableWidth: true,
      swipe: true,
      swipeToSlide: true,
      touchMove: true,
      prevArrow: <CarouselArrow dir='left' width={25} height={25} backColor='black'/>,
      nextArrow: <CarouselArrow dir='right' width={25} height={25} backColor='black'/>,
      responsive: [ {
        breakpoint: 524, settings: { arrows: false }
      } ]
    }

    var slides = carouselContent.items.map( function(slide, index) {
			return <div className='radius-3'><CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} key={`${carouselContent.id}-${index}`}/></div>
    })


    var classes = `carousel-gradient`

	  return (
	    <div className={classes} >
	      <Slider {...settings}>
	      	{slides}
	      </Slider>
	    </div>
	  );
	}
}


export default CarouselGradient
