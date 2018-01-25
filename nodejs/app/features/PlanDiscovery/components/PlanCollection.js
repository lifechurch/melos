import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { injectIntl, FormattedMessage } from 'react-intl'
import Waypoint from 'react-waypoint'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import ActionCreators from '../actions/creators'
import Carousel from '../../../components/Carousel/Carousel'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import CarouselSlideGradient from '../../../components/Carousel/CarouselSlideGradient'



class PlanCollection extends Component {
	handleLoadMore = () => {
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
					carousels.push(
						<div key={`collection-${item.id}`}>
							<Carousel
								localizedLink={localizedLink}
								isRtl={isRtl}
								carouselContent={item}
								carouselType={item.display}
								imageConfig={imageConfig}
							/>
						</div>
					)
				} else if (item.type === 'reading_plan') {
					const slideLink = localizedLink(`/reading-plans/${item.id}`)
					if (item.gradient) {
						slide = (
							<div className='radius-5' key={item.id} style={{ width: '100%' }}>
								<Link to={slideLink}>
									<CarouselSlideGradient gradient={item.gradient} id={item.id} title={item.title} />
								</Link>
							</div>
						)
					} else {
						const src = imageConfig
								&& item.image_id
								&& imageConfig.reading_plans.url
									.replace('{image_id}', item.image_id)
									.replace('{0}', 720)
									.replace('{1}', 405)
						slide = (
							<div className='radius-5' key={item.id} style={{ width: '100%', height: '100%' }}>
								<Link to={slideLink}>
									<CarouselSlideImage title={item.title}>
										<LazyImage
											src={src}
											placeholder={<img alt='Plan Default' src={PLAN_DEFAULT} />}
										/>
									</CarouselSlideImage>
								</Link>
							</div>
						)
					}
					items.push(
						<li className="collection-item" key={`item-${item.id}`}>
							{ slide }
						</li>
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
					<Link className='plans' to={localizedLink('/reading-plans')}>
						&larr;
						<FormattedMessage id="plans.plans" />
					</Link>
					<div className='collection-title'>{ title }</div>
					<div className='collection-items'>
						{ carousels }
						<div className='horizontal-center'>
							<ul className="medium-block-grid-3 small-block-grid-2" style={{ width: '100%' }}>
								{ items }
								<li><Waypoint onEnter={this.handleLoadMore} /></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

PlanCollection.propTypes = {
	collection: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired,
	imageConfig: PropTypes.object.isRequired,
	localizedLink: PropTypes.func.isRequired,
	isRtl: PropTypes.func.isRequired,
	dispatch: PropTypes.func.isRequired
}

export default injectIntl(PlanCollection)
