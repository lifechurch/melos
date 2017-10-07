import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import Immutable from 'immutable'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import { getBibleVersionFromStorage, chapterifyUsfm, parseVerseFromContent } from '../../../../lib/readerUtils'
import VOTDIcon from '../../../../components/icons/VOTD'
import Moment from '../Moment'


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
			})).then((data) => {
				if (data) {
					this.getVotd()
				}
			})
		} else {
			this.getVotd()
		}
	}

	getVotd = () => {
		const { moments, bible, dispatch } = this.props
		if (moments.votd && moments.votd.length > 0) {
			const usfm = moments.pullVotd(this.dayOfYear).usfm

			if (usfm && (bible && !bible.pullRef(chapterifyUsfm(usfm[0])))) {
				dispatch(bibleAction({
					method: 'version',
					params: {
						id: getBibleVersionFromStorage(),
					}
				}))
				dispatch(bibleAction({
					method: 'chapter',
					params: {
						id: getBibleVersionFromStorage(),
						reference: chapterifyUsfm(usfm[0]),
					}
				}))
			}
		}
	}

	render() {
		const { moments, className, bible } = this.props

		let verse
		const votd = moments && moments.pullVotd(this.dayOfYear)
		const chapterUsfm = votd && chapterifyUsfm(votd.usfm[0])
		const ref = chapterUsfm && bible && bible.pullRef(chapterUsfm)
		if (ref) {
			verse = parseVerseFromContent({
				usfms: votd.usfm,
				fullContent: ref.content,
			}).html
		}

		/* eslint-disable react/no-danger */
		return (
			<div className={`yv-votd-text ${className}`}>
				<Moment
					title={
						<div className='vertical-center'>
							<VOTDIcon />
							<div className='vertical-center flex-wrap' style={{ marginLeft: '15px' }}>
								<div style={{ width: '100%' }}><FormattedMessage id='votd' /></div>
								{ ref && ref.reference && ref.reference.human }
								{
									ref
									&& bible.versions
									&& Immutable
											.fromJS(bible)
											.hasIn([
												'versions',
												'byId',
												`${getBibleVersionFromStorage()}`,
												'response',
												'local_abbreviation'
											], false)
									&& ` ${Immutable
											.fromJS(bible)
											.getIn([
												'versions',
												'byId',
												`${getBibleVersionFromStorage()}`,
												'response',
												'local_abbreviation'
											])}`
								}
							</div>
						</div>
					}
					content={<div dangerouslySetInnerHTML={{ __html: verse }} />}
				/>
			</div>
		)
	}
}

VotdText.propTypes = {
	dayOfYear: PropTypes.number,
	className: PropTypes.string,
	bible: PropTypes.object.isRequired,
	moments: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
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
	}
}

export default connect(mapStateToProps, null)(VotdText)
