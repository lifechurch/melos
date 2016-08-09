import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class PlanCollection extends Component {

	constructor(props) {
		super(props)
		this.carousels = []
		this.lastRenderIndex = null

		if (this.props.collection.has_collections) {
			this.props.collection.items.forEach((item, index) => {
				if (item.type == 'collection') {
					this.getCollectionItems(item.id)
					this.lastRenderIndex = index
				}
			})
		}
	}

	getCollectionItems(id) {
		const { dispatch } = this.props
		// if we have a collection inside a collection, the reducer is going to populate the collection with it's items based on the flag
		dispatch(ActionCreators.collectionsItems({ "ids": [id], "collectInception": true }))
	}

	// after the api comes back with all the items for a collection inside this collection, let's push all the collections for rendering
	componentDidUpdate(prevProps, prevState) {
		// lets only run this once; after items exist for the last collection call
		if (prevProps.collection.has_collections && prevProps.collection.items[this.lastRenderIndex].items) {
			prevProps.collection.items.forEach((item) => {
				if (item.type == 'collection' && item.items) {
					console.log('PUSHING')
					console.log(item.items)
					// this.carousels.push( (<CarouselStandard carouselContent={item} imageConfig={prevProps.imageConfig}/>) )
					this.carousels.push( (<Carousel carouselContent={item} carouselType={item.display} imageConfig={prevProps.imageConfig}/>) )
				}
			})
		}
	}


	render() {
		const { collection, imageConfig } = this.props
		var items = []

		collection.items.map((item) => {
			let slide = null

			if (item.type == 'reading_plan') {
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
				items.push( (<li className="collection-item" key={item.id}>{slide}</li>) )
			}

		})

		return (
			<div className='row collections-view'>
				<div className='columns medium-12'>
					<Link className='plans' to={`/en/reading-plans`}>&larr; Plans</Link>
					<div className='collection-title'>{collection.title}</div>
					<div className='horizontal-center'>
						<div>
							{this.carousels}
						</div>
						<ul className="medium-block-grid-3 small-block-grid-2">
							{items}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default PlanCollection