import React, { Component, PropTypes } from 'react'
import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import ReaderArrows from '../../Bible/components/content/ReaderArrows'
import Share from '../../Bible/components/verseAction/share/Share'
import Helmet from 'react-helmet'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import Image from '../../../components/Carousel/Image'
import LocalStore from '../../../lib/localStore'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

class Passage extends Component {

	render() {
		const { auth, passage, isRtl, localizedLink, intl, params } = this.props

		let mainVerse, versesCarousel, plansCarousel, metaContent, metaTitle, chapterLink, relatedPlansLink = null

		// main verse and verse cards
		let verses = []
		if (passage && passage.verses && passage.verses.verses) {
			let mainVersionID = passage.verses.primaryVersion //this.getMainVersion(passage.verses.verses)
			Object.keys(passage.verses.verses).forEach((key, index) => {
				let verse = passage.verses.verses[key]

				// if we've found a main version, then let's set the maine verse
				// to that, otherwise, the main verse is just the first one
				if (mainVersionID ? verse.versionInfo.id == mainVersionID : index == 0) {
					mainVerse = (
						<div key={key} className='verse'>
							<a href={`/versions/${verse.versionInfo.id}`}>
								<h2>
									<div className='heading'>{ verse.versionInfo.local_abbreviation }</div>
									<div className='name'>{ verse.versionInfo.local_title }</div>
								</h2>
							</a>
							<Link
								to={`/bible/${verse.versionInfo.id}/${verse.usfm}.${verse.versionInfo.local_abbreviation}`}
								title={`${intl.formatMessage({ id: "Reader.read reference" }, { reference: `${verse.human}` })} ${verse.versionInfo.local_abbreviation}`}
								className='verse-content'
								dangerouslySetInnerHTML={{ __html: verse.content }}
							/>
							<div className='copyright'>{ verse.versionInfo.copyright_short.text }</div>
						</div>
					)
					metaTitle = `${passage.verses.title}; ${verse.text}`
					metaContent = `${verse.text}`
					chapterLink = `/bible/${verse.versionInfo.id}/${verse.chapUsfm}.${verse.versionInfo.local_abbreviation.toLowerCase()}`
					relatedPlansLink = `/bible/${verse.versionInfo.id}/${verse.usfm}.${params.vabbr}#related-plans`
				} else {
					let heading = (
						<a href={`/versions/${verse.versionInfo.id}`}>
							<h2>
								<div className='heading'>{ verse.versionInfo.local_abbreviation }</div>
								<div className='name'>{ verse.versionInfo.local_title }</div>
							</h2>
						</a>
					)
					verses.push(
						<li className='verse-container' key={key}>
							<VerseCard verseContent={{ [key]: passage.verses.verses[key] }} verseHeading={heading} isLink={true} />
						</li>
					)
				}
			})
		}

		// reading plans
		let items = []
		if (passage && passage.readingPlans && passage.readingPlans.items) {
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
						items.push (
							<li className="collection-item" key={`item-${item.id}`}>
								<a
									href={slideLink}
									title={`${intl.formatMessage({ id: "plans.about this plan" })}: ${item.title }`}
								>
									{slide}
								</a>
							</li>
						)
					}
				})
		}

		let plansDiv = null
		if (items.length > 0) {
			plansDiv = (
				<div className='related-plans collections-view'>
					<h2 id='related-plans' className='heading'>
						<div className='plans-title'>
							<FormattedMessage id='Reader.plan title ref' values={{ reference: passage.verses.title }} />
						</div>
						<br />
						<div className='plans-subtitle'>
							<FormattedMessage id='Reader.plan subtitle' />
						</div>
					</h2>
					<div className='row collection-items small-12'>
						<ul className='list'>
							{ items }
						</ul>
					</div>
				</div>
			)
		}

		// previous verse and next verse
		let prevArrow, nextArrow = null

		if (passage.verses && passage.verses.previous_verse) {
			prevArrow = (
				<Link
					to={`/bible/${params.version}/${passage.verses.previous_verse}.${params.vabbr.toLowerCase()}`}
					title={``}
				>
					<CarouselArrow width={23} height={23} dir='left' fill='gray'/>
				</Link>
			)
		}

		if (passage.verses && passage.verses.next_verse) {
			nextArrow = (
				<Link
					to={`/bible/${params.version}/${passage.verses.next_verse}.${params.vabbr.toLowerCase()}`}
					title={``}
				>
					<CarouselArrow width={23} height={23} dir='right' fill='gray'/>
				</Link>
			)
		}

		return (
			<div className='passage'>
				<Helmet
					title={`${metaTitle}`}
					meta={[ { name: 'description', content: `${metaContent}` } ]}
				/>
				<div className='row main-content small-12 medium-8'>
					<div className='title-heading'>
						{ prevArrow }
						<h1 className='title'>
							{ passage.verses ? passage.verses.title : null }
						</h1>
						{ nextArrow }
					</div>
					<div className='single-verse'>
						{ mainVerse }
					</div>
					<div className='buttons'>
						<Link to={chapterLink} className='chapter-button solid-button'><FormattedMessage id='Reader.read chapter' /></Link>
						<a href={relatedPlansLink} className='chapter-button solid-button'><FormattedMessage id='plans.related plans' /></a>
						<Share button={
							<a className='chapter-button solid-button'><FormattedMessage id='features.EventEdit.components.EventEditNav.share' /></a>
						}/>
					</div>
				</div>
				<div className='row verses small-12'>
					<ul className='list'>
						{ verses }
					</ul>
				</div>
				{ plansDiv }
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