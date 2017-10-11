import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import { Link } from 'react-router'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import {
	getBibleVersionFromStorage,
	chapterifyUsfm,
	parseVerseFromContent
} from '../../../../lib/readerUtils'
import { getReferencesTitle } from '../../../../lib/usfmUtils'
import Routes from '../../../../lib/routes'
import VOTDIcon from '../../../../components/icons/VOTD'
import ShareIcon from '../../../../components/icons/ShareIcon'
import { Item } from '../../../../components/OverflowMenu'
import OverflowMenu from '../../../../widgets/OverflowMenu'
import Share from '../../../Bible/components/verseAction/share/Share'
import Moment from '../Moment'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'


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
		const { moments, className, bible, serverLanguageTag, intl, hosts } = this.props

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
		const version_id = getBibleVersionFromStorage()
		const versionData = bible
			&& bible.versions
			&& bible.versions.byId
			&& bible.versions.byId[version_id]
			&& bible.versions.byId[version_id].response
		const title = versionData
			&& versionData.books
			&& getReferencesTitle({
				bookList: versionData.books,
				usfmList: votd.usfm,
			}).title
		const version_abbr = versionData
			&& versionData.local_abbreviation.toUpperCase()

		/* eslint-disable react/no-danger */
		return (
			<div className={`yv-votd-text ${className}`}>
				<Moment
					header={
						<MomentHeader
							icon={<VOTDIcon />}
							title={
								<div className='vertical-center'>
									<div className='vertical-center flex-wrap'>
										<div style={{ width: '100%' }}><FormattedMessage id='votd' /></div>
										{
											ref
												&& ref.reference
												&& ref.reference.human
												&& (
													<Link
														to={Routes.reference({
															version_id,
															usfm: chapterUsfm,
															version_abbr,
															serverLanguageTag
														})}
													>
														{ ref.reference.human }
													</Link>
												)
										}
										{
											version_abbr
											&& (
												<Link
													to={Routes.version({
														version_id,
														serverLanguageTag
													})}
												>
													&nbsp;
													{ version_abbr.toUpperCase() }
												</Link>
											)
										}
									</div>
								</div>
							}
						/>
					}
					footer={
						<MomentFooter
							right={[
								<a key='share'>
									{
										title
											&& (
												<Share
													text={`${intl.formatMessage({ id: 'votd' })} - ${title} (${version_abbr})`}
													url={`${hosts && hosts.railsHost}${Routes.votd({ query: { day: this.dayOfYear }, serverLanguageTag })}`}
													button={<ShareIcon fill='gray' />}
												/>
											)
									}
								</a>,
								<OverflowMenu
									key='overflow'
									usfm={votd && votd.usfm && votd.usfm[0]}
									version_id={version_id}
								>
									<Item link={Routes.notificationsEdit({ serverLanguageTag })}>
										<FormattedMessage id='notification settings' />
									</Item>
								</OverflowMenu>
							]}
						/>
					}
				>
					<Link
						to={Routes.reference({
							version_id,
							usfm: votd && votd.usfm && votd.usfm[0],
							version_abbr,
							serverLanguageTag
						})}
					>
						<div
							className='reader'
							style={{ color: 'black' }}
							dangerouslySetInnerHTML={{ __html: verse }}
						/>
					</Link>
				</Moment>
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
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(VotdText))
