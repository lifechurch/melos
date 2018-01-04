import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import withVersion from '@youversion/api-redux/lib/endpoints/bible/hocs/withVersion'
import VerticalSpace from '@youversion/melos/dist/components/layouts/VerticalSpace'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'
import Body from '@youversion/melos/dist/components/typography/Body'
import Link from '@youversion/melos/dist/components/links/Link'
import Routes from '@youversion/utils/lib/routes/routes'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import STORIES from '../assets/bibleStories'

function StoriesList(props) {
	const { version, serverLanguageTag } = props

	return (
		<div>
			<div style={{ width: '100%', marginBottom: '25px' }}>
				<Heading1>Bible Stories</Heading1>
			</div>
			<div className='gray-background horizontal-center flex-wrap' style={{ padding: '40px 0 80px 0' }}>
				{/* <Helmet
						title={title}
						meta={[
						{ name: 'description', content: verse },
						{ property: 'og:title', content: title },
						{ property: 'og:url', content: url },
						{ property: 'og:description', content: verse },
						{ name: 'twitter:card', content: 'summary' },
						{ name: 'twitter:url', content: url },
						{ name: 'twitter:title', content: title },
						{ name: 'twitter:description', content: verse },
						{ name: 'twitter:site', content: '@YouVersion' },
					]}
				/> */}
				<div className='yv-large-4 yv-medium-6 yv-small-11 votd-view' style={{ width: '100%' }}>
					<VerticalSpace space={10}>
						{
							STORIES && STORIES.map((story) => {
								if (!(story && story.references)) return null
								return (
									<Card key={story.id}>
										<Link
											to={Routes.reference({
												usfm: story.references[0],
												version_id: version && version.id
											})}
										>
											<Heading3>{ story.title_localization_key }</Heading3>
										</Link>
										<Body muted>
											<div className='comma-list'>
												{
													story.references.map((ref) => {
														const { usfm, title } = getReferencesTitle({
															usfmList: ref,
															bookList: version && version.books
														})
														return (
															<Link
																key={ref}
																className='font-grey'
																to={Routes.reference({ usfm, version_id: version && version.id })}
															>
																{ title }
															</Link>
														)
													})
												}
											</div>
										</Body>
									</Card>
								)
							})
						}
					</VerticalSpace>
				</div>
			</div>
		</div>
	)
}

StoriesList.propTypes = {

}

StoriesList.defaultProps = {

}

export default withVersion(StoriesList)
