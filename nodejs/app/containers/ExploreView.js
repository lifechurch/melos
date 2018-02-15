import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import Explore from '../features/Explore/components/Explore'


function ExploreView(props) {
	const { location: { query }, intl, hosts, serverLanguageTag } = props

	const version_id = (query && query.version)
			|| getBibleVersionFromStorage(serverLanguageTag)

	return (
		<Explore
			version_id={version_id}
		/>
	)
}

ExploreView.propTypes = {
	location: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
}

ExploreView.defaultProps = {
	hasVotdImages: false,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(ExploreView))
