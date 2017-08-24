import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { injectIntl, FormattedMessage } from 'react-intl'
import Waypoint from 'react-waypoint'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import CarouselSlideGradient from '../../../components/Carousel/CarouselSlideGradient'
import Image from '../../../components/Carousel/Image'

class PlanCollection extends Component {

	loadMore(currentPosition, previousPosition) {
		const { dispatch, collection } = this.props
		if (collection.next_page > 0) {
			return new Promise((resolve, reject) => {
				dispatch(ActionCreators.collectionsItems({ ids: [collection.id], page: collection.next_page, uiFocus: true })).then((collectionItems) => {
					// if we have a collection inside a collection, the reducer is going to populate the collection with it's items based on the flag
					const ids = []
					collectionItems.collections[0].items.map((item) => {
						if (item.type === 'collection') {
							ids.push(item.id)
						}
					})

					if (ids.length > 0) {
						resolve(dispatch(ActionCreators.collectionsItems({ ids, collectInception: true })))
					} else {
						resolve()
					}
				}, reject)
			})
		}
		return null
	}

	render() {
		const { collection, intl, imageConfig, localizedLink, isRtl } = this.props
		const items = []
		const carousels = []

		let title
		if (collection.context === 'recommended') {
			title = <FormattedMessage id='plans.related plans' />
		} else if (collection.context === 'saved') {
			title = <FormattedMessage id='plans.saved plans' />
		} else {
			title = collection.title
		}

		if (collection.items) {
			collection.items.forEach((item) => {
				let slide = null

				if (item.type === 'collection' && item.items && item.items.length > 0) {
					carousels.push(<div key={`collection-${item.id}`}><Carousel localizedLink={localizedLink} isRtl={isRtl} carouselContent={item} carouselType={item.display} imageConfig={imageConfig} /></div>)
				} else if (item.type === 'reading_plan') {
					const slideLink = localizedLink(`/reading-plans/${item.id}`)
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
								<CarouselSlideGradient gradient={item.gradient} id={item.id} title={item.title} />
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
								<li className="collection-item" key={`item-${item.id}`}>
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
				<Helmet
					title={`${intl.formatMessage({ id: 'plans.title' })}: ${intl.formatMessage({ id: 'plans.browse plans' }, { category: collection.title })}`}
					meta={[ { name: 'description', content: `${intl.formatMessage({ id: 'plans.title' })}: ${intl.formatMessage({ id: 'plans.browse plans' }, { category: collection.title })}` } ]}
				/>
				<div className='columns medium-12'>
					<Link className='plans' to={localizedLink('/reading-plans')}>&larr; <FormattedMessage id="plans.plans" /></Link>
					<div className='collection-title'>{ title }</div>
					<div className='collection-items'>
						{ carousels }
						<div className='horizontal-center'>
							<ul className="medium-block-grid-3 small-block-grid-2">
								{ items }
								<li><Waypoint onEnter={::this.loadMore} /></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default injectIntl(PlanCollection)
