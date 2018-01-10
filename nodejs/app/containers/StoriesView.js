import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import StoriesList from '../features/Explore/components/StoriesList'

function StoriesView(props) {
	const { serverLanguageTag, location: { query } } = props
	const version_id = (query && query.version)
		|| getBibleVersionFromStorage(serverLanguageTag)
	return (
		<div>
			<div style={{ width: '100%', marginBottom: '25px' }}>
				<Heading1><FormattedMessage id='bible stories' /></Heading1>
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
					<StoriesList version_id={version_id} />
				</div>
			</div>
		</div>
	)
}

StoriesView.propTypes = {
	serverLanguageTag: PropTypes.string,
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
