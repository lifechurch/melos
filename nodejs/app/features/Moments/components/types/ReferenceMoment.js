import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { Link } from 'react-router'
import bibleAction from '@youversion/api-redux/lib/endpoints/bible/action'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import shareAction from '../../../../widgets/ShareSheet/action'
import {
	getBibleVersionFromStorage,
	chapterifyUsfm,
	parseVerseFromContent
} from '../../../../lib/readerUtils'
import { getReferencesTitle } from '../../../../lib/usfmUtils'
import Routes from '../../../../lib/routes'
import Like from '../../../../components/Like'
import ShareIcon from '../../../../components/icons/ShareIcon'
import OverflowMenu from '../../../../widgets/OverflowMenu'
import Moment from '../Moment'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'


class ReferenceMoment extends Component {
	componentDidMount() {
		this.getReference()
	}

	componentWillReceiveProps(nextProps) {
		const { usfm } = this.props
		if (nextProps.usfm && usfm !== nextProps.usfm) {
			this.getReference()
		}
	}

	getReference = () => {
		const { usfm, bible, dispatch } = this.props
		if (usfm) {
			if (usfm && (bible && !bible.pullRef(chapterifyUsfm(usfm)))) {
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
						reference: chapterifyUsfm(usfm),
					}
				}))
			}
		}
	}

	handleShare = ({ text, url }) => {
		const { dispatch } = this.props
		dispatch(shareAction({
			isOpen: true,
			text,
			url,
		}))
	}

	render() {
		const {
			className,
			usfm,
			icon,
			title,
			likedIds,
			commentIds,
			onLike,
			onComment,
			onEdit,
			onDelete,
			overflowMenuChildren,
			bible,
			serverLanguageTag,
			auth,
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
		const titleString = refStrings && refStrings.title
		const version_abbr = versionData
			&& versionData.local_abbreviation.toUpperCase()

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
										titleString
											&& (
												<Link
													to={Routes.reference({
														version_id,
														usfm: chapterUsfm,
														version_abbr,
														serverLanguageTag
													})}
												>
													{ titleString }
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
					likedIds={likedIds}
					commentIds={commentIds}
					footer={
						<MomentFooter
							left={[
								(onLike
									&& <Like
										onClick={onLike}
										isFilled={likedIds
											&& auth.userData
											&& likedIds.includes(auth.userData.userid)
										}
									/>
								),
								(onComment
									&& <Comment onClick={onComment} />
								),
							]}
							right={[
								refStrings
									&& refStrings.title
									&& (
										<a
											tabIndex={0}
											onClick={this.handleShare.bind(this, {
												text: `${intl.formatMessage({ id: 'votd' })} - ${refStrings.title} (${version_abbr})`,
												url: `${hosts && hosts.railsHost}${Routes.votd({ query: { day: this.dayOfYear }, serverLanguageTag })}`,
											})}
										>
											<ShareIcon fill='gray' />
										</a>
									),
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
						{ /* eslint-disable react/no-danger */ }
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

ReferenceMoment.propTypes = {
	usfm: PropTypes.string.isRequired,
	icon: PropTypes.node,
	title: PropTypes.string,
	likedIds: PropTypes.array,
	commentIds: PropTypes.array,
	onLike: PropTypes.func,
	onComment: PropTypes.func,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	overflowMenuChildren: PropTypes.node,
	auth: PropTypes.object.isRequired,
	className: PropTypes.string,
	bible: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	hosts: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired,
}

ReferenceMoment.defaultProps = {
	className: '',
	icon: null,
	title: null,
	likedIds: null,
	commentIds: null,
	onLike: null,
	onComment: null,
	onEdit: null,
	onDelete: null,
	overflowMenuChildren: null,
}

function mapStateToProps(state) {
	return {
		bible: getBibleModel(state),
		moments: getMomentsModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
		auth: state.auth,
	}
}

export default connect(mapStateToProps, null)(injectIntl(ReferenceMoment))
