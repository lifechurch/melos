import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import Helmet from 'react-helmet'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import parseVerseFromContent from '@youversion/utils/lib/bible/parseVerseContent'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import Header from '../features/Header/components/Header'
import Footer from '../features/Footer/components/Footer'
import VotdText from '../features/Moments/components/types/VotdText'
import VotdImage from '../features/Moments/components/types/VotdImage'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'
import PlansRelatedToReference from '../widgets/PlansRelatedToReference'
import Card from '../components/Card'
import { localizedLink } from '../lib/routeUtils'
import Routes from '../lib/routes'


class VOTDView extends Component {
	componentDidMount() {
		const { moments, dispatch } = this.props
		if (!(moments && moments.configuration)) {
			dispatch(momentsAction({
				method: 'configuration',
			}))
		}
	}

	render() {
		const { location: { query }, moments, bible, intl, hosts, serverLanguageTag } = this.props


		return (
			<div className='gray-background horizontal-center' style={{ padding: '50px 0' }}>
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
				<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view'>
					hihihih
				</div>
				<ShareSheet />
			</div>
		)
	}
}

VOTDView.propTypes = {
	moments: PropTypes.object,
	location: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

VOTDView.defaultProps = {
	moments: null,
	bible: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		moments: getMomentsModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(VOTDView))
