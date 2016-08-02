import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import CarouselArrow from './CarouselArrow'
import { Link } from 'react-router'

class CarouselGradient extends Component {
  render() {
		const { carouselContent } = this.props

    var settings = {
      centerMode: false,
      infinite: true,
      variableWidth: true,
      slidesToScroll: 2,
      prevArrow: <CarouselArrow dir='left' width={25} height={25} backColor='black'/>,
      nextArrow: <CarouselArrow dir='right' width={25} height={25} backColor='black'/>,
      responsive: [ {
        breakpoint: 524, settings: { arrows: false }
      } ]
    }

    var slides = carouselContent.items.map( function(slide, index) {
			return (
        <div className='radius-3' key={`${carouselContent.id}-${index}`}>
          <Link to={`/en/reading-plans/collection/${slide.id}`}>
            <CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title}/>
          </Link>
        </div>
      )
    })

    var classes = `carousel-gradient`

	  return (
	    <div className={classes} >
       <Slider {...settings}>{slides}</Slider>
	    </div>
	  );
	}
}


export default CarouselGradient
