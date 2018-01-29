import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import Helmet from 'react-helmet'
import withVersion from '@youversion/api-redux/lib/endpoints/bible/hocs/withVersion'
import withVotd from '@youversion/api-redux/lib/endpoints/moments/hocs/withVotd'
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
