import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import Helmet from 'react-helmet'
import VerticalSpace from '@youversion/melos/dist/components/layouts/VerticalSpace'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import Body from '@youversion/melos/dist/components/typography/Body'
import Link from '@youversion/melos/dist/components/links/Link'
import Routes from '@youversion/utils/lib/routes/routes'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import EmotionPicker from '../features/Explore/components/EmotionPicker'
import TopicList from '../features/Explore/components/TopicList'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'
import VerseImagesGrid from '../widgets/VerseImagesGrid'


function ExploreView(props) {
	const { location: { query }, intl, hosts, serverLanguageTag } = props

	const version_id = (query && query.version)
			|| getBibleVersionFromStorage(serverLanguageTag)
	const title = intl.formatMessage({ id: 'explore the bible' })
	const description = intl.formatMessage({ id: 'explore the bible description' })
	const url = `${hosts && hosts.railsHost}${Routes.explore({
		query: {
			version: version_id
		}
	})}`
	return (
		<div>
			<div style={{ width: '100%', marginBottom: '25px' }}>
				<Heading1><FormattedMessage id='explore' /></Heading1>
			</div>
			<div className='gray-background horizontal-center flex-wrap' style={{ padding: '50px 0 100px 0' }}>
				<Helmet
					title={title}
					meta={[
							{ name: 'description', content: description },
							{ property: 'og:title', content: title },
							{ property: 'og:url', content: url },
							{ property: 'og:description', content: description },
							{ name: 'twitter:card', content: 'summary' },
							{ name: 'twitter:url', content: url },
							{ name: 'twitter:title', content: title },
							{ name: 'twitter:description', content: description },
							{ name: 'twitter:site', content: '@YouVersion' },
					]}
				/>
				<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view' style={{ width: '100%' }}>
					<VerticalSpace>
						<Card>
							<div style={{ marginBottom: '25px' }}>
								<Heading2><FormattedMessage id='what does the bible say' /></Heading2>
							</div>
							<TopicList version_id={version_id} />
						</Card>
						<Card>
							<EmotionPicker
								category='sad'
								version_id={version_id}
							/>
						</Card>
						<Link to={Routes.exploreStories({ serverLanguageTag, query: { version: version_id } })}>
							<Card>
								<Heading2><FormattedMessage id='bible stories' /></Heading2>
								<div style={{ width: '75%', textAlign: 'center', margin: '10px auto 0 auto' }}>
									<Body muted><FormattedMessage id='STORIESEXAMPLES' /></Body>
								</div>
							</Card>
						</Link>
						<Card>
							<VerseImagesGrid
								linkBuilder={({ usfm }) => {
									return Routes.reference({
										usfm: usfm.join('+'),
										version_id
									})
								}}
								version_id={version_id}
							/>
						</Card>
					</VerticalSpace>
				</div>
				<ShareSheet />
			</div>
		</div>
	)
}

ExploreView.propTypes = {
	location: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
}

ExploreView.defaultProps = {
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(ExploreView))
