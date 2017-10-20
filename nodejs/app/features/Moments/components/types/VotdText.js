import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import shareAction from '../../../../widgets/ShareSheet/action'
import { getBibleVersionFromStorage } from '../../../../lib/readerUtils'
import Routes from '../../../../lib/routes'
import VOTDIcon from '../../../../components/icons/VOTD'
import { Item } from '../../../../components/OverflowMenu'
import ReferenceMoment from './ReferenceMoment'


class VotdText extends Component {
	constructor(props) {
		super(props)
		const { dayOfYear } = this.props
		this.dayOfYear = parseInt(dayOfYear || moment().dayOfYear(), 10)
	}

	componentDidMount() {
		const { moments, dispatch, serverLanguageTag } = this.props
		if (!(moments && moments.pullVotd(this.dayOfYear))) {
			dispatch(momentsAction({
				method: 'votd',
				params: {
					language_tag: serverLanguageTag,
				}
			}))
		}
	}

	handleShare = ({ refTitle }) => {
		const { dispatch, serverLanguageTag, intl, hosts } = this.props
		dispatch(shareAction({
			isOpen: true,
			text: `${intl.formatMessage({ id: 'votd' })} - ${refTitle}`,
			url: `${hosts && hosts.railsHost}${Routes.votd({
				query: { day: this.dayOfYear },
				serverLanguageTag
			})}`,
		}))
	}

	render() {
		const { moments, className, serverLanguageTag } = this.props

		const votd = moments && moments.pullVotd(this.dayOfYear)
		const version_id = getBibleVersionFromStorage(serverLanguageTag)
		/* eslint-disable react/no-danger */
		return (
			<ReferenceMoment
				className={className}
				icon={<VOTDIcon />}
				title={
					<h1
						style={{
							all: 'unset',
							width: '100%',
							marginBottom: '3px',
							color: 'black'
						}}
					>
						<FormattedMessage id='votd' />
					</h1>
				}
				usfm={votd && votd.usfm}
				version_id={version_id}
				overflowMenuChildren={
					<Item link={Routes.notificationsEdit({ serverLanguageTag })}>
						<FormattedMessage id='notification settings' />
					</Item>
				}
				onShare={this.handleShare}
			/>
		)
	}
}

VotdText.propTypes = {
	dayOfYear: PropTypes.number,
	className: PropTypes.string,
	moments: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
}

VotdText.defaultProps = {
	dayOfYear: null,
	className: '',
}

function mapStateToProps(state) {
	return {
		bible: getBibleModel(state),
		moments: getMomentsModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(VotdText))
