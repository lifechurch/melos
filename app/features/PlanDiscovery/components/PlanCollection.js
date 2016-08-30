import React, { Component, PropTypes } from 'react'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import Image from '../../../components/Carousel/Image'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { injectIntl, FormattedMessage } from 'react-intl'
import Waypoint from 'react-waypoint'

class PlanCollection extends Component {

	loadMore(currentPosition, previousPosition) {
		const { dispatch, collection } = this.props
		if (collection.next_page > 0) {
			dispatch(ActionCreators.collectionsItems({ ids: [collection.id], page: collection.next_page, uiFocus: true }))
		}
	}

	render() {
		const { collection, intl, imageConfig, localizedLink, isRtl } = this.props
		var items = []
		var carousels = []

		var title = (collection.context == 'recommended') ? <FormattedMessage id='plans.related plans' /> : (collection.context == 'saved') ? <FormattedMessage id='plans.saved plans' />  : collection.title

		if (collection.items) {
			collection.items.forEach((item) => {
					let slide = null

					if (item.type == 'collection') {
						carousels.push( <div key={`collection-${item.id}`}><Carousel localizedLink={localizedLink} isRtl={isRtl} carouselContent={item} carouselType={item.display} imageConfig={imageConfig}/></div> )
					} else if (item.type == 'reading_plan') {
						var slideLink = localizedLink(`/reading-plans/${item.id}`)
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
					title={`${intl.formatMessage({ id: "plans.title" })}: ${intl.formatMessage({ id: "plans.browse plans" }, { category: collection.title })}`}
					meta={[ { name: 'description', content: `${intl.formatMessage({ id: "plans.title" })}: ${intl.formatMessage({ id: "plans.browse plans" }, { category: collection.title })}` } ]}
				/>
				<div className='columns medium-12'>
					<Link className='plans' to={localizedLink(`/reading-plans`)}>&larr; <FormattedMessage id="plans.plans" /></Link>
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