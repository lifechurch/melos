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

    	var slideLink = (slide.type == 'collection') ? `/en/reading-plans/collection/${slide.id}` : `/en/reading-plans/${slide.id}`

    	if (slide.image_id) {
				return (
					<div className='radius-5' >
						<Link to={slideLink}>
							<CarouselSlideImage title={slide.title}>
	    					<Image width={320} height={180} thumbnail={false} imageId={slide.image_id} type={slide.type} config={imageConfig} />
	    				</CarouselSlideImage>
    				</Link>
					</div>
				)
			} else if (slide.gradient) {
				return (
					<div className='radius-5' >
						<Link to={slideLink}>
							<CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title}/>
						</Link>
					</div>
				)
			} else {
				return (
					<div className='radius-5' >
						<Link to={slideLink}>
							<CarouselSlideImage title={slide.title} >
								<Image width={320} height={180} thumbnail={false} imageId='default' type={slide.type} config={imageConfig} />
							</CarouselSlideImage>
						</Link>
					</div>
				)
			}
    })


	  return (
	    <div className='carousel-standard' >
	    	<Link className='header' to={`/en/reading-plans/collection/${carouselContent.id}`}>
	    		<div className='title'>{`${carouselContent.title}`}</div>
	    		<div className='see-all'><FormattedMessage id="plans.see all" /></div>
	    		<CarouselArrow width={19} height={19} fill='gray'/>
	    	</Link>
				<Slider {...settings}>{slides}</Slider>
	    </div>
	  );
	}
}


export default CarouselStandard
