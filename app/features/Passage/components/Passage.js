import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import { buildMeta } from '../../../lib/readerUtils'
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
	let mainVerse, metaContent, metaTitle, verseError = null
	let chapterLink = ''
	let nextLink = ''
	let prevLink = ''
	let metaLink = {}

	const {
		passage,
		localizedLink,
		intl,
		isRtl,
		hosts,
		params: {
			splat,
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

	const verseKey = `${splat.split('.').slice(0, 3).join('.')}`.toUpperCase()

	let primaryVersion = {}
	// main verse and verse cards
	const verseCards = []
	if (typeof verses === 'object' && (verseKey in verses)) {
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
							to={localizedLink(`/bible/${verse.version}/${primaryVersion.passage}.${version.local_abbreviation}`)}
							title={`${intl.formatMessage({ id: 'Reader.read reference' }, { reference: `${verse.human}` })} ${version.local_abbreviation.toLocaleUpperCase()}`}
							className='verse-content'
							dangerouslySetInnerHTML={{ __html: verse.content }}
						/>
						<div className='copyright'>{ version.copyright_short.text }</div>
					</div>
				)
				metaTitle = `${primaryVersion.human}; ${primaryVersion.text}`
				metaContent = `${primaryVersion.text}`
				metaLink = buildMeta({ hosts, version, usfm: primaryVersion.passage }).link
				chapterLink = localizedLink(`/bible/${verse.version}/${verse.chapUsfm}.${version.local_abbreviation.toLowerCase()}`)
				nextLink = localizedLink(`/bible/${verse.version}/${primaryVersion.nextVerse}.${version.local_abbreviation.toLowerCase()}`)
				prevLink = localizedLink(`/bible/${verse.version}/${primaryVersion.previousVerse}.${version.local_abbreviation.toLowerCase()}`)
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
	} else {
		const {
			verses: {
				primaryVersion: {
					passage: invalidPassage,
					version: invalidVersion
				}
			}
		} = passage

		let invalidChapter = invalidPassage.split('.')
		invalidChapter.splice(2, 1)
		invalidChapter = invalidChapter.join('.')

		verseError = <FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
		chapterLink = localizedLink(`/bible/${invalidVersion}/${invalidChapter}`)
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
							<CarouselSlideImage title={item.name}>
								<Image width={720} height={405} thumbnail={false} imageId={item.image_id} type={item.type} config={passage.configuration.images} />
							</CarouselSlideImage>
						</div>
						)
				} else {
					slide = (
						<div className='radius-5' >
							<CarouselSlideImage title={item.name}>
								<Image width={720} height={405} thumbnail={false} imageId='default' type={item.type} config={passage.configuration.images} />
							</CarouselSlideImage>
						</div>
						)
				}
				items.push(
					<li className="collection-item" key={`item-${item.id}`}>
						<a
							href={slideLink}
							title={`${intl.formatMessage({ id: 'plans.about this plan' })}: ${item.name}`}
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
					to={prevLink}
					title={''}
				>
					<CarouselArrow width={23} height={23} dir='left' fill='gray' />
				</Link>
			)
		} else {
			prevArrow = (
				<Link
					to={prevLink}
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
					to={nextLink}
					title={''}
				>
					<CarouselArrow width={23} height={23} dir='right' fill='gray' />
				</Link>
			)
		} else {
			nextArrow = (
				<Link
					to={nextLink}
					title={''}
				>
					<CarouselArrow width={23} height={23} dir='right' fill='gray' />
				</Link>
			)
		}
	}

	return (
		<div className='passage reader'>
			{ mainVerse &&
				<Helmet
					title={`${metaTitle}`}
					meta={[ { name: 'description', content: `${metaContent}` } ]}
					link={[ ...metaLink ]}
				/>
			}
			{ verseError &&
				<Helmet
					title={intl.formatMessage({ id: 'Reader.chapterpicker.chapter unavailable' })}
				/>
			}
			<div className='row main-content small-12 medium-8'>
				{ mainVerse &&
					<div className='title-heading'>
						{ prevArrow }
						<h1 className='title'>
							{ passage.verses && primaryVersion ? primaryVersion.human : null }
						</h1>
						{ nextArrow }
					</div>
				}
				<div className='single-verse'>
					{ mainVerse || verseError }
				</div>
				<div className='buttons'>
					{ mainVerse &&
						<Link to={chapterLink} className='chapter-button solid-button'><FormattedMessage id='Reader.read chapter' /></Link>
					}
					{(mainVerse && (items.length > 0)) &&
						<a tabIndex={0} onClick={scrollToRelatedPlans} className='chapter-button solid-button'><FormattedMessage id='plans.related plans' /></a>
					}
					{ verseError &&
						<Link to={chapterLink} className='chapter-button solid-button'><FormattedMessage id='Reader.chapterpicker.choose chapter' /></Link>
					}
					{ verseError &&
						<Link to={{ pathname: chapterLink, query: { openPicker: 'version' } }} className='chapter-button solid-button'><FormattedMessage id='Reader.versionpicker.choose version' /></Link>
					}
					{ mainVerse &&
						<Share
							button={
								<a className='chapter-button solid-button'><FormattedMessage id='features.EventEdit.components.EventEditNav.share' /></a>
							}
						/>
					}
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
	intl: PropTypes.object.isRequired,
	isRtl: PropTypes.func.isRequired,
}

export default injectIntl(Passage)
