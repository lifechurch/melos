import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'

class PlanCollection extends Component {


	render() {
		const { collection, imageConfig } = this.props
		var items = []
		var carousels = []

		if (collection.items) {
			collection.items.forEach((item) => {
					let slide = null

					if (item.type == 'collection') {
						carousels.push( <div><Carousel carouselContent={item} carouselType={item.display} imageConfig={imageConfig}/></div> )
					} else if (item.type == 'reading_plan') {
						var slideLink = `/en/reading-plans/${item.id}`
						if (item.image_id) {
							slide = (
								<div className='radius-5' >
									<CarouselSlideImage title={item.title}>
										<Image width={720} height={405} thumbnail={false} imageId={item.image_id} type={item.type} config={imageConfig} />
									</CarouselSlideImage>
								</div>
							)
						} else if (item.gradient) {
							slide = (
								<div className='radius-5' >
									<CarouselSlideGradient gradient={item.gradient} id={item.id} title={item.title}/>
								</div>
							)
						} else {
							slide = (
								<div className='radius-5' >
									<CarouselSlideImage title={item.title}>
										<Image width={720} height={405} thumbnail={false} imageId='default' type={item.type} config={imageConfig} />
									</CarouselSlideImage>
								</div>
							)
						}
						items.push(
							(
								<li className="collection-item" key={item.id}>
									<Link to={slideLink}>
										{slide}
									</Link>
								</li>
							)
						)
					}
				})
		}


		return (
			<div className='row collections-view'>
				<div className='columns medium-12'>
					<Link className='plans' to={`/en/reading-plans`}>&larr; Plans</Link>
					<div className='collection-title'>{collection.title}</div>
					<div className='collection-items'>
						{carousels}
						<div className='horizontal-center'>
							<ul className="medium-block-grid-3 small-block-grid-2">
								{items}
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default PlanCollection