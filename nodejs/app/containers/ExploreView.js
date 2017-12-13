import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import Helmet from 'react-helmet'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import TopicList from '../features/Explore/components/TopicList'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'


class ExploreView extends Component {
	componentDidMount() {
		const { moments, dispatch } = this.props
	}

	render() {
		const { location: { query }, moments, bible, intl, hosts, serverLanguageTag } = this.props


		return (
			<div>
				<div style={{ width: '100%', marginBottom: '25px' }}>
					<Heading1>Explore</Heading1>
				</div>
				<div className='gray-background horizontal-center flex-wrap' style={{ padding: '50px 0' }}>
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
					<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view' style={{ width: '100%' }}>
						<Card>
							<div style={{ marginBottom: '25px' }}>
								<Heading2>What does the Bible say about...</Heading2>
							</div>
							<TopicList />
						</Card>
					</div>
					<ShareSheet />
				</div>
			</div>
		)
	}
}

ExploreView.propTypes = {
	moments: PropTypes.object,
	location: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

ExploreView.defaultProps = {
	moments: null,
	bible: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(ExploreView))
