import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { FormattedMessage, injectIntl } from 'react-intl'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import Routes from '@youversion/utils/lib/routes/routes'
import Body from '@youversion/melos/dist/components/typography/Body'
import Link from '@youversion/melos/dist/components/links/Link'
import SectionedLayout from '@youversion/melos/dist/components/layouts/SectionedLayout'
import StoriesList from '../features/Explore/components/StoriesList'

function StoriesView(props) {
	const { serverLanguageTag, location: { query }, intl, hosts } = props

	const version_id = (query && query.version)
		|| getBibleVersionFromStorage(serverLanguageTag)
	const title = intl.formatMessage({ id: 'bible stories' })
	const description = intl.formatMessage({ id: 'STORIESEXAMPLES' })
	const url = `${hosts && hosts.railsHost}${Routes.exploreStories({
		serverLanguageTag
	})}`

	return (
		<div>
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
			<div
				className='yv-large-6 yv-medium-9 yv-small-11 centered'
				style={{ marginBottom: '25px' }}
			>
				<SectionedLayout
					left={(
						<Link
							to={Routes.explore({
								serverLanguageTag,
								query: { version: version_id }
							})}
						>
							<Body muted>
								<FormattedMessage id='explore' />
							</Body>
						</Link>
					)}
				>
					<Heading1>
						<FormattedMessage id='bible stories' />
					</Heading1>
				</SectionedLayout>
			</div>
			<div
				className='gray-background horizontal-center flex-wrap'
				style={{ padding: '40px 0 80px 0' }}
			>
				<div
					className='yv-large-4 yv-medium-6 yv-small-11 votd-view'
					style={{ width: '100%' }}
				>
					<StoriesList version_id={version_id} />
				</div>
			</div>
		</div>
	)
}

StoriesView.propTypes = {
	serverLanguageTag: PropTypes.string,
	location: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
}

StoriesView.defaultProps = {
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(StoriesView))
