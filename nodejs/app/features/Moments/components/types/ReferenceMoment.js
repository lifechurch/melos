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
		const {
			className,
			usfm,
			icon,
			title,
			onLike,
			onComment,
			onEdit,
			onDelete,
			overflowMenuChildren,
			bible,
			serverLanguageTag,
			intl,
			hosts
		} = this.props

		let verse
		const chapterUsfm = usfm && chapterifyUsfm(usfm)
		const ref = chapterUsfm && bible && bible.pullRef(chapterUsfm)
		if (ref) {
			verse = parseVerseFromContent({
				usfms: usfm,
				fullContent: ref.content,
			}).html
		}
		const version_id = getBibleVersionFromStorage()
		const versionData = bible
			&& bible.versions
			&& bible.versions.byId
			&& bible.versions.byId[version_id]
			&& bible.versions.byId[version_id].response
		const refStrings = versionData
			&& versionData.books
			&& getReferencesTitle({
				bookList: versionData.books,
				usfmList: usfm,
			})
		const usfmString = refStrings && refStrings.usfm
		const version_abbr = versionData
			&& versionData.local_abbreviation.toUpperCase()

		/* eslint-disable react/no-danger */
		return (
			<div className={`yv-votd-text ${className}`}>
				<Moment
					header={
						<MomentHeader
							icon={icon}
							title={
								<div className='vertical-center flex-wrap'>
									{ title }
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
							}
						/>
					}
					footer={
						<MomentFooter
							left={[
								(onLike
									&& <Like onClick={onLike} />),
								(onComment
									&& <Comment onClick={onComment} />),
							]}
							right={[
								<a key='share'>
									{
										refStrings
											&& refStrings.title
											&& (
												<Share
													text={`${intl.formatMessage({ id: 'votd' })} - ${refStrings.title} (${version_abbr})`}
													url={`${hosts && hosts.railsHost}${Routes.votd({ query: { day: this.dayOfYear }, serverLanguageTag })}`}
													button={<ShareIcon fill='gray' />}
												/>
											)
									}
								</a>,
								<OverflowMenu
									key='overflow'
									usfm={usfm}
									version_id={version_id}
									onEdit={onEdit}
									onDelete={onDelete}
								>
									{ overflowMenuChildren }
								</OverflowMenu>
							]}
						/>
					}
				>
					<Link
						to={Routes.reference({
							version_id,
							usfm: usfmString,
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
	hosts: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired,
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
