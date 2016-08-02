import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'

class PlanCollection extends Component {
	render() {
		const { collection, imageConfig } = this.props

		const items = collection.items.map((item) => {
			let slide = null
			if (item.image_id) {
				slide = (
					<CarouselSlideImage title={item.title}>
						<Image width={720} height={405} thumbnail={false} imageId={item.image_id} type={item.type} config={imageConfig} />
					</CarouselSlideImage>
				)
			} else if (item.gradient) {
				slide = (
					<CarouselSlideGradient gradient={item.gradient} id={item.id} title={item.title}/>
				)
			} else {
				slide = (
					<CarouselSlideImage title={item.title}>
						<Image width={720} height={405} thumbnail={false} imageId='default' type={item.type} config={imageConfig} />
					</CarouselSlideImage>
				)
			}

			return (<li key={item.id}>{slide}</li>)
		})

		return (
			<div className='row'>
				<div className='columns medium-12'>
					<Link to={`/en/reading-plans`}>&larr; Plans</Link>
					<h1>{collection.title}</h1>
					<ul className="medium-block-grid-3 small-block-grid-2">
						{items}
					</ul>
				</div>
			</div>
		)
	}
}

export default PlanCollection