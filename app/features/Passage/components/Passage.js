import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import Share from '../../Bible/components/verseAction/share/Share'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import Image from '../../../components/Carousel/Image'

function Passage(props) {
	const { passage, localizedLink, intl, params } = props

	let mainVerse, metaContent, metaTitle, chapterLink, relatedPlansLink = null

	// main verse and verse cards
	const verses = []
	if (passage && passage.verses && passage.verses.verses) {
		const mainVersionID = passage.verses.primaryVersion.version
		Object.keys(passage.verses.verses['JHN.3.27']).forEach((key, index) => {
			const verse = passage.verses.verses['JHN.3.27'][key]

			// if we've found a main version, then let's set the maine verse
			// to that, otherwise, the main verse is just the first one
			if (mainVersionID ? verse.versionInfo.id === mainVersionID : index === 0) {
				mainVerse = (
					<div key={key} className='verse'>
						<a href={`/versions/${verse.versionInfo.id}`}>
							<h2>
								<div className='heading'>{ verse.versionInfo.local_abbreviation.toLocaleUpperCase() }</div>
								<div className='name'>{ verse.versionInfo.local_title }</div>
							</h2>
						</a>
						<Link
							to={localizedLink(`/bible/${verse.versionInfo.id}/${verse.usfm}.${verse.versionInfo.local_abbreviation}`)}
							title={`${intl.formatMessage({ id: 'Reader.read reference' }, { reference: `${verse.human}` })} ${verse.versionInfo.local_abbreviation.toLocaleUpperCase()}`}
							className='verse-content'
							dangerouslySetInnerHTML={{ __html: verse.content }}
						/>
						<div className='copyright'>{ verse.versionInfo.copyright_short.text }</div>
					</div>
				)
				metaTitle = `${passage.verses.primaryVersion.title}; ${verse.text}`
				metaContent = `${verse.text}`
				chapterLink = localizedLink(`/bible/${verse.versionInfo.id}/${verse.chapUsfm}.${verse.versionInfo.local_abbreviation.toLowerCase()}`)
				relatedPlansLink = localizedLink(`/bible/${verse.versionInfo.id}/${verse.usfm}.${params.vabbr}#related-plans`)
			} else {
				const heading = (
					<a href={localizedLink(`/versions/${verse.versionInfo.id}`)}>
						<h2>
							<div className='heading'>{ verse.versionInfo.local_abbreviation.toLocaleUpperCase() }</div>
							<div className='name'>{ verse.versionInfo.local_title }</div>
						</h2>
					</a>
				)
				verses.push(
					<li className='verse-container' key={key}>
						<VerseCard
							localizedLink={localizedLink}
							verseContent={{ [key]: passage.verses.verses['JHN.3.27'][key] }}
							verseHeading={heading}
							isLink={true}
						/>
					</li>
				)
			}
		})
	}

	// reading plans
	const items = []
	if (passage && passage.readingPlans && passage.readingPlans.items) {
		passage.readingPlans.items.forEach((item) => {
			let slide = null

			if (item.type === 'reading_plan') {
				const slideLink = localizedLink(`/reading-plans/${item.id}-${item.slug}`)
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
					<li className="collection-item" key={`item-${item.id}`}>
						<a
							href={slideLink}
							title={`${intl.formatMessage({ id: 'plans.about this plan' })}: ${item.title}`}
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
						<FormattedMessage id='Reader.plan title ref' values={{ reference: passage.verses.primaryVersion.title }} />
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

	if (passage.verses && passage.verses.primaryVersion && passage.verses.primaryVersion.previousVerse) {
		prevArrow = (
			<Link
				to={localizedLink(`/bible/${params.version}/${passage.verses.primaryVersion.previousVerse}.${params.vabbr.toLowerCase()}`)}
				title={''}
			>
				<CarouselArrow width={23} height={23} dir='left' fill='gray' />
			</Link>
		)
	}

	if (passage.verses && passage.verses.primaryVersion && passage.verses.primaryVersion.nextVerse) {
		nextArrow = (
			<Link
				to={localizedLink(`/bible/${params.version}/${passage.verses.primaryVersion.nextVerse}.${params.vabbr.toLowerCase()}`)}
				title={''}
			>
				<CarouselArrow width={23} height={23} dir='right' fill='gray' />
			</Link>
		)
	}

	return (
		<div className='passage reader'>
			<Helmet
				title={`${metaTitle}`}
				meta={[ { name: 'description', content: `${metaContent}` } ]}
			/>
			<div className='row main-content small-12 medium-8'>
				<div className='title-heading'>
					{ prevArrow }
					<h1 className='title'>
						{ passage.verses && passage.verses.primaryVersion ? passage.verses.primaryVersion.human : null }
					</h1>
					{ nextArrow }
				</div>
				<div className='single-verse'>
					{ mainVerse }
				</div>
				<div className='buttons'>
					<Link to={chapterLink} className='chapter-button solid-button'><FormattedMessage id='Reader.read chapter' /></Link>
					<a href={relatedPlansLink} className='chapter-button solid-button'><FormattedMessage id='plans.related plans' /></a>
					<Share
						button={
							<a className='chapter-button solid-button'><FormattedMessage id='features.EventEdit.components.EventEditNav.share' /></a>
						}
					/>
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


/**
 *
 */
Passage.propTypes = {
	localizedLink: PropTypes.func.isRequired,
	passage: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired
}

export default injectIntl(Passage)
