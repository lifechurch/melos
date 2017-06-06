import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import CarouselArrow from './CarouselArrow'
import { Link } from 'react-router'

class CarouselGradient extends Component {
  render() {
		const { carouselContent, localizedLink, isRtl } = this.props

    var settings = {
      centerMode: false,
      infinite: true,
      variableWidth: true,
      slidesToScroll: 2,
      rtl: isRtl(),
      prevArrow: <CarouselArrow dir='left' width={25} height={25} backColor='black'/>,
      nextArrow: <CarouselArrow dir='right' width={25} height={25} backColor='black'/>,
      responsive: [ {
        breakpoint: 524, settings: { arrows: false, slidesToScroll: 1 }
      } ]
    }

    const slideStyle = isRtl() ? { display: 'inline-block' } : {}

    var slides = carouselContent.items.map( function(slide, index) {
			return (
        <div className='radius-3' key={`${carouselContent.id}-${index}`} style={slideStyle}>
          <Link to={localizedLink(`/reading-plans-collection/${slide.id}-${slide.slug}`)}>
            <CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title}/>
          </Link>
        </div>
      )
    })

    var classes = `carousel-gradient`

    let slider = null

    if (isRtl()) {

      const outerStyle = {
        width: "100%",
        overflowX: "scroll"
      }

      const innerStyle = {
        width: 10000
      }

      slider = <div className='rtl-faux-slider' style={outerStyle}><div style={innerStyle}>{slides}</div></div>
    } else {
      slider = <Slider {...settings}>{slides}</Slider>
    }

	  return (
	    <div className={classes} >
       {slider}
	    </div>
	  );
	}
}


export default CarouselGradient
