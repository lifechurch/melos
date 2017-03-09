import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import VerseCard from '../../Bible/components/verseAction/bookmark/VerseCard'
import Share from '../../Bible/components/verseAction/share/Share'
import CarouselSlideImage from '../../../components/Carousel/CarouselSlideImage'
import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import Image from '../../../components/Carousel/Image'


function scrollToRelatedPlans() {
	const relatedPlansElement = document.getElementById('related-plans')
	if (typeof relatedPlansElement !== 'undefined') {
		const scrollPos = relatedPlansElement.offsetTop - relatedPlansElement.scrollHeight
		window.scrollTo(0, scrollPos)
	}
}

function Passage(props) {
	let mainVerse, metaContent, metaTitle, chapterLink = null

	const {
		passage,
		localizedLink,
		intl,
		isRtl,
		params: {
			book,
			chapter,
			verse: verseNumber,
			vabbr,
			version: primaryVersionId
		}
	} = props

	const {
		verses: {
			verses,
			versions: {
				versions
			}
		}
	} = passage

	const verseKey = `${book}.${chapter}.${verseNumber}`.toUpperCase()

	let primaryVersion = {}

	// main verse and verse cards
	const verseCards = []
	if (typeof verses === 'object') {
		Object.keys(verses[verseKey]).forEach((versionKey) => {
			const verse = verses[verseKey][versionKey]
			const version = versions[verse.version]

			verse.versionInfo = version

			// if we've found a main version, then let's set the maine verse
			// to that, otherwise, the main verse is just the first one
			if (verse.version === parseInt(primaryVersionId, 10)) {
				primaryVersion = verse
				mainVerse = (
					<div key={versionKey} className='verse'>
						<a href={`/versions/${verse.version}`}>
							<h2>
								<div className='heading'>{ version.local_abbreviation.toLocaleUpperCase() }</div>
								<div className='name'>{ version.local_title }</div>
							</h2>
						</a>
						<Link
							to={localizedLink(`/bible/${verse.version}/${verse.usfm}.${version.local_abbreviation}`)}
							title={`${intl.formatMessage({ id: 'Reader.read reference' }, { reference: `${verse.human}` })} ${version.local_abbreviation.toLocaleUpperCase()}`}
							className='verse-content'
							dangerouslySetInnerHTML={{ __html: verse.content }}
						/>
						<div className='copyright'>{ version.copyright_short.text }</div>
					</div>
				)
				metaTitle = `${primaryVersion.human}; ${primaryVersion.text}`
				metaContent = `${primaryVersion.text}`
				chapterLink = localizedLink(`/bible/${verse.version}/${verse.chapUsfm}.${version.local_abbreviation.toLowerCase()}`)
			} else {
				const heading = (
					<a href={localizedLink(`/versions/${verse.version}`)}>
						<h2>
							<div className='heading'>{ version.local_abbreviation.toLocaleUpperCase() }</div>
							<div className='name'>{ version.local_title }</div>
						</h2>
					</a>
				)

				verseCards.push(
					<li className='verse-container' key={versionKey}>
						<VerseCard
							localizedLink={localizedLink}
							verseContent={{ [verseKey]: verses[verseKey][versionKey] }}
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
			<div className='related-plans collections-view' >
				<h2 id='related-plans' className='heading'>
					<div className='plans-title'>
						<FormattedMessage id='Reader.plan title ref' values={{ reference: primaryVersion.human }} />
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
	if (passage.verses && primaryVersion && primaryVersion.previousVerse) {
		if (isRtl()) {
			nextArrow = (
				<Link
					to={localizedLink(`/bible/${primaryVersion.version}/${primaryVersion.previousVerse}.${vabbr.toLowerCase()}`)}
					title={''}
				>
					<CarouselArrow width={23} height={23} dir='left' fill='gray' />
				</Link>
			)
		} else {
			prevArrow = (
				<Link
					to={localizedLink(`/bible/${primaryVersion.version}/${primaryVersion.previousVerse}.${vabbr.toLowerCase()}`)}
					title={''}
				>
					<CarouselArrow width={23} height={23} dir='left' fill='gray' />
				</Link>
			)
		}
	}

	if (passage.verses && primaryVersion && primaryVersion.nextVerse) {
		if (isRtl()) {
			prevArrow = (
				<Link
					to={localizedLink(`/bible/${primaryVersion.version}/${primaryVersion.nextVerse}.${vabbr.toLowerCase()}`)}
					title={''}
				>
					<CarouselArrow width={23} height={23} dir='right' fill='gray' />
				</Link>
			)
		} else {
			nextArrow = (
				<Link
					to={localizedLink(`/bible/${primaryVersion.version}/${primaryVersion.nextVerse}.${vabbr.toLowerCase()}`)}
					title={''}
				>
					<CarouselArrow width={23} height={23} dir='right' fill='gray' />
				</Link>
			)
		}
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
						{ passage.verses && primaryVersion ? primaryVersion.human : null }
					</h1>
					{ nextArrow }
				</div>
				<div className='single-verse'>
					{ mainVerse }
				</div>
				<div className='buttons'>
					<Link to={chapterLink} className='chapter-button solid-button'><FormattedMessage id='Reader.read chapter' /></Link>
					{
						(items.length > 0) &&
						<a tabIndex={0} onClick={scrollToRelatedPlans} className='chapter-button solid-button'><FormattedMessage id='plans.related plans' /></a>
					}
					<Share
						button={
							<a className='chapter-button solid-button'><FormattedMessage id='features.EventEdit.components.EventEditNav.share' /></a>
						}
					/>
				</div>
			</div>
			<div className='row verses small-12'>
				<ul className='list'>
					{ verseCards }
				</ul>
			</div>
			{ plansDiv }
		</div>
	)
}

Passage.propTypes = {
	localizedLink: PropTypes.func.isRequired,
	passage: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired
}

export default injectIntl(Passage)
