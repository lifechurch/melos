import React, { Component, PropTypes } from 'react'
import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import ReaderArrows from '../../Bible/components/content/ReaderArrows'
import Helmet from 'react-helmet'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import Image from '../../../components/Carousel/Image'
import LocalStore from '../../../lib/localStore'
import { injectIntl, FormattedMessage } from 'react-intl'


class Passage extends Component {

	/**
	 * get the version for the main, big verse based on the user's previous versions.
	 * if the last version cookie matches, use that. if not check last 5 recent versions
	 * and match one of those. finally if none of those match (new user that hasn't
	 * been to the site?) then just use the version of the first verse back from the
	 * api
	 *
	 * @param      {object}  verses  verses object of verse objects to display
	 */
	getMainVersion(verses) {
		// if the following checks don't match any version cookies, than it'll just
		// be the first version back from the verses call
		if (Object.keys(verses).length > 0) {
			let mainVersion = verses[Object.keys(verses)[0]].versionInfo.id
			let usfm = verses[Object.keys(verses)[0]].usfm
			let lastVersion = LocalStore.get('version')
			let recentVersions = LocalStore.get('RecentVersions').data

			// first check last version
			if (lastVersion && `${lastVersion}-${usfm}` in verses) {
				mainVersion = lastVersion

			// then go through recent versions and check those
			} else {
				if (recentVersions.length > 0) {
					recentVersions.forEach((version, index) => {
						// for each one that matches, we'll overwrite,
						// because the last one in the array is the most
						// recent
						if (`${version}-${usfm}` in verses) {
							mainVersion = version
						}
					})
				}
			}

			return mainVersion
		} else {
			return null
		}
	}

	render() {
		const { auth, passage, isRtl, localizedLink, intl } = this.props

		let mainVerse, versesCarousel, plansCarousel, metaContent, metaTitle, chapterLink, relatedPlansLink = null

		// main verse and verse cards
		let verses = []
		if (passage && passage.verses && passage.verses.verses) {
			let mainVersionID = this.getMainVersion(passage.verses.verses)
			console.log(mainVersionID)
			Object.keys(passage.verses.verses).forEach((key, index) => {
				let verse = passage.verses.verses[key]
				// if we've found a main version, then let's set the maine verse
				// to that, otherwise, the main verse is just the first one
				if (mainVersionID ? verse.versionInfo.id == mainVersionID : index == 0) {
					mainVerse = (
						<div key={key} className='verse'>
							<h2>
								<div className='heading'>{ verse.versionInfo.local_abbreviation }</div>
								<div className='name'>{ verse.versionInfo.local_title }</div>
							</h2>
							<a
								href={`/bible/${verse.versionInfo.id}/${verse.usfm}`}
								title={`${intl.formatMessage({ id: "read reference" }, { reference: `${verse.human}` })} ${verse.versionInfo.local_abbreviation}`}
								className='verse-content'
								dangerouslySetInnerHTML={{ __html: verse.content }}
							/>
						</div>
					)
					metaTitle = `${passage.verses.title}; ${verse.text}`
					metaContent = `${verse.text}`
					chapterLink = `bible/${verse.versionInfo.id}/${verse.chapUsfm}`
					relatedPlansLink = `/passage/${verse.usfm}#related-plans`
				} else {
					let heading = (
						<h2>
							<div className='heading'>{ verse.versionInfo.local_abbreviation }</div>
							<div className='name'>{ verse.versionInfo.local_title }</div>
						</h2>
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
					<h2 id='related-plans' className='heading'><FormattedMessage id='plans related to reference' values={{ reference: passage.verses.title }} /></h2>
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
		if (passage.verses.previous_verse) {
			prevArrow = (
				<a
					href={`/passage/${passage.verses.previous_verse}`}
					title={``}
				>
					<CarouselArrow width={23} height={23} dir='left' fill='gray'/>
				</a>
			)
		}
		if (passage.verses.next_verse) {
			nextArrow = (
				<a
					href={`/passage/${passage.verses.next_verse}`}
					title={``}
				>
					<CarouselArrow width={23} height={23} dir='right' fill='gray'/>
				</a>
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
							{ passage.verses.title }
						</h1>
						{ nextArrow }
					</div>
					<div className='single-verse'>
						{ mainVerse }
					</div>
					<div className='buttons'>
						<a href={chapterLink} className='chapter-button solid-button'><FormattedMessage id='read chapter' /></a>
						<a href={relatedPlansLink} className='chapter-button solid-button'><FormattedMessage id='related plans' /></a>
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