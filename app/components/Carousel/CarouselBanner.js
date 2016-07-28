import React, { Component } from 'react'
import Slider from 'react-slick'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import Image from './Image'
import CarouselArrow from './CarouselArrow'

class CarouselBanner extends Component {
	render() {
		const { carouselContent, imageConfig } = this.props

    var settings = {
      centerMode: true,
      infinite: true,
      variableWidth: true,
      initialSlide: 0,
      slickGoTo: 0,
			arrows: true,
			prevArrow: <CarouselArrow dir='left' width='30' height='30' backColor='black'/>,
			nextArrow: <CarouselArrow dir='right' width='30' height='30' backColor='black'/>,
      responsive: [ {
      	breakpoint: 524, settings: { arrows: false }
      } ]
    };

		// var settings = {
		// 	autoplay: true,
		// 	initialSlideHeight: 300,
		// 	initialSlideWidth: 600,
		// 	slidesToShow: 3,
		// 	slidesToScroll: 1,
		// 	slideIndex: 0,
		// 	slideWidth: '500px',
		// 	width: '1300px',
		// 	cellAlign: 'center',
		// 	dragging: true,
		// 	wrapAround: true,
		// 	afterSlide: function() { console.log('after slide')},
		// 	beforeSlide: function() { console.log('before slide')},
		// 	decorators: [
		// 		{
		// 			component: React.createClass({
		// 				render() {
		// 					return (<button onClick={this.props.previousSlide}>&larr;</button>)
		// 					//return (<CarouselArrow dir='right' width='30' height='30' backColor='black' onClick={this.props.previousSlide}/>)
		// 				}
		// 			}),
		// 			position: 'CenterLeft',
		// 			style: {
		// 				padding: 20
		// 			}
		// 		},
		// 		{
		// 			component: React.createClass({
		// 				render() {
		// 					return (<button onClick={this.props.nextSlide}>&rarr;</button>)
		// 					//return (<CarouselArrow dir='right' width='30' height='30' backColor='black' onClick={this.props.previousSlide}/>)
		// 				}
		// 			}),
		// 			position: 'CenterRight',
		// 			style: {
		// 				padding: 20
		// 			}
		// 		}
		// 	]
		// }

		// for banner carousels, we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
		var slides = carouselContent.items.map( function(slide, index) {
			if (slide.image_id) {
				return (
					<div className='' key={`${carouselContent.id}-${index}`}>
						<CarouselSlideImage>
							<Image width={720} height={405} thumbnail={false} imageId={slide.image_id} type={slide.type} config={imageConfig} />
						</CarouselSlideImage>
					</div>
				)
			} else if (slide.gradient) {
				return <div className='' key={`${carouselContent.id}-${index}`}><CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title}/></div>
			} else {
				return (
					<div className='' key={`${carouselContent.id}-${index}`}>
						<CarouselSlideImage>
							<Image width={720} height={405} thumbnail={false} imageId='default' type={slide.type} config={imageConfig} />
						</CarouselSlideImage>
					</div>
				)
			}
		})

		return (
			<div className='carousel-banner'>
				<Slider {...settings}>{slides}</Slider>
			</div>
		);
	}
}


export default CarouselBanner
