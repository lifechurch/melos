import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import Moment from '../Moment'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'
import Routes from '../../../../lib/routes'
import { Item } from '../../../../components/OverflowMenu'
import OverflowMenu from '../../../../widgets/OverflowMenu'
import VerseImagesSlider from '../../../../widgets/VerseImagesSlider'


class VotdImage extends Component {
	constructor(props) {
		super(props)
		const { dayOfYear, serverLanguageTag } = this.props
		this.dayOfYear = parseInt((dayOfYear || moment().dayOfYear()), 10)
		this.version_id = getBibleVersionFromStorage(serverLanguageTag)
	}

	componentDidMount() {
		const { moments, dispatch, serverLanguageTag } = this.props
		if (!(moments && moments.pullVotd(this.dayOfYear) && moments.pullVotd(this.dayOfYear).image_id)) {
			dispatch(momentsAction({
				method: 'votd',
				params: {
					language_tag: serverLanguageTag,
				}
			}))
		}
	}

	render() {
		const { moments, className, serverLanguageTag, bible } = this.props

		const usfm = moments.pullVotd(this.dayOfYear)
			&& moments.pullVotd(this.dayOfYear).usfm
		const version = bible.pullVersion(this.version_id)
		const title = version
			&& version.books
			&& getReferencesTitle({
				bookList: version.books,
				usfmList: usfm,
			}).title
		return (
			usfm
				&& (
					<div className={`yv-votd-image ${className}`}>
						<Moment
							header={
								<MomentHeader
									title={title}
								/>
							}
							footer={
								<MomentFooter
									right={[
										<OverflowMenu
											key='overflow'
											usfm={usfm}
											version_id={this.version_id}
										>
											<Item link={Routes.notificationsEdit({ serverLanguageTag })}>
												<FormattedMessage id='notification settings' />
											</Item>
										</OverflowMenu>
									]}
								/>
							}
						>
							<VerseImagesSlider
								usfm={usfm}
								category='prerendered'
							/>
						</Moment>
					</div>
				)
		)
	}
}

VotdImage.propTypes = {
	dayOfYear: PropTypes.number,
	className: PropTypes.string,
	moments: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

VotdImage.defaultProps = {
	dayOfYear: null,
	images: null,
	className: '',
}

function mapStateToProps(state) {
	return {
		moments: getMomentsModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(VotdImage)
