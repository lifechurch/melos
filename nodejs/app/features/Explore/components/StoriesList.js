import React, { PropTypes } from 'react'
import withVersion from '@youversion/api-redux/lib/endpoints/bible/hocs/withVersion'
import VerticalSpace from '@youversion/melos/dist/components/layouts/VerticalSpace'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'
import Body from '@youversion/melos/dist/components/typography/Body'
import Link from '@youversion/melos/dist/components/links/Link'
import Routes from '@youversion/utils/lib/routes/routes'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import STORIES from '../assets/bibleStories'

function StoriesList(props) {
	const { version, serverLanguageTag } = props

	return (
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
							<div className='comma-list'>
								{
									story.references.map((ref) => {
										const { usfm, title } = getReferencesTitle({
											usfmList: ref,
											bookList: version && version.books
										})
										return (
											<Body key={ref} muted>
												<Link
													className='font-grey'
													to={Routes.reference({
														usfm,
														version_id: version && version.id,
														version_abbr: version && version.local_abbreviation,
														serverLanguageTag
													})}
												>
													{ title }
												</Link>
											</Body>
										)
									})
								}
							</div>
						</Card>
					)
				})
			}
		</VerticalSpace>
	)
}

StoriesList.propTypes = {
	version: PropTypes.object,
	serverLanguageTag: PropTypes.string,
}

StoriesList.defaultProps = {
	version: null,
	serverLanguageTag: 'en',
}

export default withVersion(StoriesList)
