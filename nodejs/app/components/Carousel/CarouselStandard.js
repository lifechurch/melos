import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import CarouselSlideGradient from './CarouselSlideGradient'
import CarouselSlideImage from './CarouselSlideImage'
import CarouselArrow from './CarouselArrow'


function CarouselStandard(props) {
	const { carouselContent, imageConfig, localizedLink, context, isRtl } = props

	const carouselTitle = carouselContent.title
		? carouselContent.title
		: <FormattedMessage id='plans.related plans' />
	// for a dynamic collection we need to build, the header link will be different
	let carouselLink = `/reading-plans-collection/${carouselContent.id}`
	if (context === 'recommended') {
		carouselLink = `/recommended-plans-collection/${carouselContent.id}`
	} else if (context === 'saved') {
		carouselLink = '/saved-plans-collection'
	}
	const slideStyle = isRtl() ? { display: 'inline-block' } : {}
	let slider = null

	const settings = {
		centerMode: false,
		infinite: false,
		variableWidth: true,
		slidesToScroll: 2,
		slidesToShow: 2,
		arrows: true,
		rtl: isRtl(),
		prevArrow: <CarouselArrow dir='left' fill='gray' width={19} height={19} />,
		nextArrow: <CarouselArrow dir='right' fill='gray' width={19} height={19} />,
		responsive: [ {
			breakpoint: 524, settings: { arrows: false, slidesToShow: 1, slidesToScroll: 1 }
		} ]
	}

	if (carouselContent.items && carouselContent.items.length > 0) {
		// we want an image first, if that doesn't exist then we go to gradient, if gradient doesn't exist then just set default plan image
		const slides = carouselContent.items.map((slide) => {

			const slug = slide.slug ? `-${slide.slug}` : ''
			const slideLink = slide.type === 'collection'
				? localizedLink(`/reading-plans-collection/${slide.id}${slug}`)
				: localizedLink(`/reading-plans/${slide.id}${slug}`)

			if (slide.gradient) {
				return (
					<div className='radius-5' key={slide.id} style={slideStyle}>
						<Link to={slideLink}>
							<CarouselSlideGradient gradient={slide.gradient} id={slide.id} title={slide.title} />
						</Link>
					</div>
				)
			} else {
				let src
				if (slide.type === 'collection') {
					src = imageConfig
            && slide.image_id
            && imageConfig.collections.url
              .replace('{image_id}', slide.image_id)
              .replace('{0}', 320)
              .replace('{1}', 180)
				} else {
					src = imageConfig
            && slide.image_id
            && imageConfig.reading_plans.url
              .replace('{image_id}', slide.image_id)
              .replace('{0}', 320)
              .replace('{1}', 180)
				}
				return (
					<div className='radius-5' key={slide.id} style={slideStyle}>
						<Link to={slideLink}>
							<CarouselSlideImage title={slide.title}>
								<LazyImage
									src={src}
									placeholder={<img alt='Plan Default' src={PLAN_DEFAULT} width={320} height={180} />}
									width={225}
									height={125}
								/>
							</CarouselSlideImage>
						</Link>
					</div>
				)
			}
		})

		if (isRtl()) {
			const outerStyle = {
				width: '100%',
				overflowX: 'scroll'
			}

			const innerStyle = {
				width: 10000,
				display: 'flex'
			}

			slider = (
				<div className='rtl-faux-slider' style={outerStyle}>
					<div style={innerStyle}>
						{ slides }
					</div>
				</div>
			)
		} else {
			slider = <Slider {...settings}>{slides}</Slider>
		}
	}

	let heading = null
	if (context === false) {
		heading = (
			<div className='carousel-header'>
				<div className='title'>
					<FormattedMessage id="plans.related plans" />
				</div>
			</div>
		)
	} else {
		heading = (
			<Link className='carousel-header' to={localizedLink(carouselLink)}>
				<div className='title'>{ carouselTitle }</div>
				<div className='see-all'><FormattedMessage id="plans.see all" /></div>
				<CarouselArrow width={19} height={19} fill='gray' />
			</Link>
			)
	}

	return (
		<div className='carousel-standard' >
			{ heading }
			{ slider }
		</div>
	)
}

CarouselStandard.propTypes = {
	carouselContent: PropTypes.object.isRequired,
	imageConfig: PropTypes.object.isRequired,
	localizedLink: PropTypes.func.isRequired,
	context: PropTypes.string,
	isRtl: PropTypes.func.isRequired,
}

CarouselStandard.defaultProps = {
	context: null,
}

export default CarouselStandard
