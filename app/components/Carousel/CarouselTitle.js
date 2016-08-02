import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideTitle from './CarouselSlideTitle'
import CarouselArrow from './CarouselArrow'

class CarouselTitle extends Component {
  render() {
		const { carouselContent } = this.props

    var settings = {
    	centerMode: false,
      infinite: true,
      variableWidth: true,
      slidesToScroll: 3,
      prevArrow: <CarouselArrow dir='left' width={20} height={20} fill='gray' backColor='whitesmoke'/>,
      nextArrow: <CarouselArrow dir='right' width={20} height={20} fill='gray' backColor='whitesmoke'/>,
      responsive: [ {
      	breakpoint: 524, settings: { arrows: false }
      } ]
    };

    var slides = carouselContent.items.map( function(slide, index) {
			return <div className='slide' key={`${carouselContent.id}-${index}`}><CarouselSlideTitle id={slide.id} title={slide.title}/></div>
    })

    var classes = `carousel-title`

	  return (
	    <div className={classes} >
       <Slider {...settings}>
         {slides}
       </Slider>
	    </div>
	  );
	}
}


export default CarouselTitle
