import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'


class CarouselBanner extends Component {
  render() {
		const { carouselContent } = this.props

    var settings = {
      className: 'center',
      centerMode: true,
      infinite: true,
      centerPadding: '60px',
      variableWidth: true,
      slidesToShow: 3,
    };

    // for banner carousels, we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
    var slides = carouselContent.items.map( function(slide, index) {
    	if (slide.image_id) {
				// return <div className='slide'><CarouselSlideImage imageComponent={} key={`${carouselContent.id}-${index}`}/></div>
				return <div></div>
			} else if (slide.gradient) {
				return <div className='slide'><CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} key={`${carouselContent.id}-${index}`}/></div>
			} else {
				// return <div className='slide'><CarouselSlideImage image={} id={slide.id} key={`${carouselContent.id}-${index}`}/></div>
				return <div></div>
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
