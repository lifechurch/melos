import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import Image from './Image'
import CarouselArrow from './CarouselArrow'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

class CarouselStandard extends Component {
  render() {
		const { carouselContent, imageConfig } = this.props

    var settings = {
    	centerMode: false,
      infinite: true,
      variableWidth: true,
      arrows: true,
      slidesToScroll: 2,
      prevArrow: <CarouselArrow dir='left' fill='gray' width={19} height={19}/>,
      nextArrow: <CarouselArrow dir='right' fill='gray' width={19} height={19}/>,
      responsive: [ {
      	breakpoint: 524, settings: { arrows: false }
      } ]
    };

    // we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
    var slides = carouselContent.items.map( function(slide, index) {
    	if (slide.image_id) {
				return (
					<div className='radius-5'>
						<CarouselSlideImage title={slide.title} key={`${index}`}>
    					<Image width={320} height={180} thumbnail={false} imageId={slide.image_id} type={slide.type} config={imageConfig} />
    				</CarouselSlideImage>
					</div>
				)
			} else if (slide.gradient) {
				return <div className='radius-5' key={`${carouselContent.id}-${index}`}><CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title}/></div>
				return <div className='radius-5'><CarouselSlideGradient gradient={slide.gradient} title={slide.title} key={`${index}`}/></div>
			} else {
				return (
					<CarouselSlideImage title={slide.title} key={`${index}`}>
						<Image width={320} height={180} thumbnail={false} imageId='default' type={slide.type} config={imageConfig} />
					</CarouselSlideImage>
				)
			}
    })

    var classes = `carousel-standard`

	  return (
	    <div className={classes} >
	    	<Link className='header' to={`/en/reading-plans/collection/${carouselContent.id}`}>
	    		<div className='title'>{`${carouselContent.type == 'saved' ? 'Saved Plans' : carouselContent.title}`}</div>
	    		<div className='see-all'><FormattedMessage id="plans.see all" /></div>
	    		<CarouselArrow width={19} height={19} fill='gray'/>
	    	</Link>
				<Slider {...settings}>{slides}</Slider>
	    </div>
	  );
	}
}


export default CarouselStandard
