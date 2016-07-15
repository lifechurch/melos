import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideTitle from './CarouselSlideTitle'


class CarouselTitle extends Component {
  render() {
		const { carouselContent } = this.props

    var settings = {
    	centerMode: false,
      infinite: true,
      variableWidth: true,
    };

    var slides = carouselContent.items.map( function(slide, index) {
			return <div className='slide'><CarouselSlideTitle id={slide.id} title={slide.title} key={`${carouselContent.id}-${index}`}/></div>
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
