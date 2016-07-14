import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'


class CarouselGradient extends Component {
  render() {
		const { carouselContent } = this.props

    console.log(carouselContent)
    var settings = {
      className: 'center',
      centerMode: true,
      infinite: true,
      centerPadding: '60px',
      variableWidth: true,
      slidesToShow: 3,
    };

    var slides = carouselContent.items.map( function(slide, index) {
			return <div className='slide'><CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} key={`${carouselContent.id}-${index}`}/></div>
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
