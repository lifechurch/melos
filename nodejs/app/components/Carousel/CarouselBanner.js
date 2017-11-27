import React, { PropTypes } from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import CarouselArrow from './CarouselArrow'
import LazyImage from '../LazyImage'


function CarouselBanner(props) {
	const { carouselContent, imageConfig, localizedLink, isRtl } = props

	const settings = {
		centerMode: true,
		infinite: true,
		variableWidth: true,
		initialSlide: 0,
		slickGoTo: 0,
		arrows: true,
		rtl: isRtl(),
		prevArrow: <CarouselArrow dir='left' width='30' height='30' backColor='black' />,
		nextArrow: <CarouselArrow dir='right' width='30' height='30' backColor='black' />,
		responsive: [ {
			breakpoint: 524, settings: { arrows: false, slidesToShow: 1, slidesToScroll: 1 }
		} ]
	};

		// for banner carousels, we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
	const slides = carouselContent.items.map((slide) => {

		const slideLink = slide.type === 'collection'
			? localizedLink(`/reading-plans-collection/${slide.id}-${slide.slug}`)
			: localizedLink(`/reading-plans/${slide.id}-${slide.slug}`)

		const slideStyle = isRtl() ? { display: 'inline-block' } : {}

		if (slide.gradient) {
			return (
				<div className='radius-5' key={slide.id} style={slideStyle}>
					<Link to={slideLink}>
						<CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} />
					</Link>
				</div>
			)
		} else {
			const src = imageConfig
					&& slide.image_id
					&& imageConfig.reading_plans.url
						.replace('{image_id}', slide.image_id)
						.replace('{0}', 720)
						.replace('{1}', 405)
			return (
				<div className='radius-5' key={slide.id} style={slideStyle}>
					<Link to={slideLink}>
						<CarouselSlideImage title={slide.title}>
							<LazyImage
								lazy={false}
								src={src}
								placeholder={<img alt='Plan Default' src={PLAN_DEFAULT} width={600} height={350} />}
								width='100%'
								height='100%'
							/>
						</CarouselSlideImage>
					</Link>
				</div>
			)
		}
	})

	let slider = null
	if (isRtl()) {
		const outerStyle = {
			width: '100%',
			overflowX: 'scroll'
		}
		const innerStyle = {
			width: 10000
		}

		slider = (
			<div className='rtl-faux-slider' style={outerStyle}>
				<div style={innerStyle}>{ slides }</div>
			</div>
			)

	} else {
		slider = <Slider {...settings}>{ slides }</Slider>
	}

	return (
		<div className='carousel-banner'>
			{ slider }
		</div>
	)
}

CarouselBanner.propTypes = {
	carouselContent: PropTypes.object.isRequired,
	imageConfig: PropTypes.object.isRequired,
	localizedLink: PropTypes.func.isRequired,
	isRtl: PropTypes.func.isRequired,
}

CarouselBanner.defaultProps = {

}

export default CarouselBanner
