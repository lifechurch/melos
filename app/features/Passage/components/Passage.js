import React, { Component, PropTypes } from 'react'
import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import Helmet from 'react-helmet'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import Image from '../../../components/Carousel/Image'
import { injectIntl, FormattedMessage } from 'react-intl'


class Passage extends Component {

	render() {
		const { auth, passage, isRtl, localizedLink, intl } = this.props

		let mainVerse, versesCarousel, plansCarousel, metaContent, metaTitle = null

		let verses = []
		if (passage && passage.verses && passage.verses.verses) {
			Object.keys(passage.verses.verses).forEach((key, index) => {
				let verse = passage.verses.verses[key]
				if (index == 0) {
					mainVerse = (
						<div key={key} className='verse'>
							<div className='heading'>{ `${verse.heading}` }</div>
							<div className='verse-content' dangerouslySetInnerHTML={{ __html: verse.content }}/>
						</div>
					)
					metaTitle = `${passage.verses.title}: ${verse.text}`
					metaContent = `${verse.text}`
				} else {
					let verse = { [key]: passage.verses.verses[key] }
					verses.push(
						<li className='verse-container' key={key}>
							<VerseCard verses={verse} />
						</li>
					)
				}
			})
		}

		let items = []
		if (passage.readingPlans.items) {
			passage.readingPlans.items.forEach((item) => {
					let slide = null

					if (item.type == 'reading_plan') {
						let slideLink = localizedLink(`/reading-plans/${item.id}-${item.slug}`)
						if (item.image_id) {
							slide = (
								<div className='radius-5' >
									<CarouselSlideImage title={item.title}>
										<Image width={720} height={405} thumbnail={false} imageId={item.image_id} type={item.type} config={passage.configuration.images} />
									</CarouselSlideImage>
								</div>
							)
						} else {
							slide = (
								<div className='radius-5' >
									<CarouselSlideImage title={item.title}>
										<Image width={720} height={405} thumbnail={false} imageId='default' type={item.type} config={passage.configuration.images} />
									</CarouselSlideImage>
								</div>
							)
						}
						items.push(
									(
										<li className="collection-item" key={`item-${item.id}`}>
											<a
												href={slideLink}
												title={`${intl.formatMessage({ id: "plans.about this plan" })}: ${item.title }`}
											>
												{slide}
											</a>
										</li>
									)
						)
					}
				})
		}

		return (
			<div className='passage'>
				<Helmet
					title={`${metaTitle}`}
					meta={[ { name: 'description', content: `${metaContent}` } ]}
				/>
				<div className='row main-content'>
					<h1 className='title'>{ passage.verses.title }</h1>
					<div className='single-verse'>
						{ mainVerse }
					</div>
					<a className='chapter-button solid-button'><FormattedMessage id='read chapter' /></a>
				</div>
				<div className='row verses'>
					<ul className='list'>
						{ verses }
					</ul>
				</div>
				<div className='related-plans collections-view'>
					<h2 className='heading'><FormattedMessage id='plans related to reference' values={{ reference: passage.verses.title }} /></h2>
					<div className='row horizontal-center collection-items'>
						<ul className='list'>
							{ items }
						</ul>
					</div>
				</div>
			</div>
		)
	}
}


/**
 *
 */
Passage.propTypes = {

}

export default injectIntl(Passage)