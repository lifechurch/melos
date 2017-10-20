import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
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
		if (usfm && bible && !bible.pullRef(chapterifyUsfm(usfm))) {
			dispatch(bibleAction({
				method: 'version',
				params: {
					id: this.version_id,
				}
			}))
			dispatch(bibleAction({
				method: 'chapter',
				params: {
					id: this.version_id,
					reference: chapterifyUsfm(usfm),
				}
			}))
		}
	}

	handleShare = () => {
		const { dispatch, hosts, onShare, serverLanguageTag } = this.props
		const refTitle = `${this.refStrings.title} (${this.version_abbr})`
		if (onShare && typeof onShare === 'function') {
			onShare({ refTitle, refText: this.verseContent.text })
		} else {
			dispatch(shareAction({
				isOpen: true,
				text: this.verseContent.text,
				url: `${hosts && hosts.railsHost}${Routes.reference({
					usfm: this.refStrings.usfm,
					version_id: this.version_id,
					serverLanguageTag
				})}`,
			}))
		}
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
		} = this.props

		this.version_id = getBibleVersionFromStorage(serverLanguageTag)
		let verse
		const chapterUsfm = usfm && chapterifyUsfm(usfm)
		const ref = chapterUsfm && bible && bible.pullRef(chapterUsfm)
		if (ref) {
			this.verseContent = parseVerseFromContent({
				usfms: usfm,
				fullContent: ref.content,
			})
			verse = this.verseContent.html
		}
		const versionData = bible
			&& bible.versions
			&& bible.versions.byId
			&& bible.versions.byId[this.version_id]
			&& bible.versions.byId[this.version_id].response
		this.refStrings = versionData
			&& versionData.books
			&& getReferencesTitle({
				bookList: versionData.books,
				usfmList: usfm,
			})
		const usfmString = this.refStrings && this.refStrings.usfm
		const titleString = this.refStrings && this.refStrings.title
		this.version_abbr = versionData
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
												<a
													target='_self'
													href={Routes.reference({
														version_id: this.version_id,
														usfm: chapterUsfm,
														version_abbr: this.version_abbr,
														serverLanguageTag
													})}
												>
													{ titleString }
												</a>
											)
									}
									{
										this.version_abbr
											&& (
												<a
													target='_self'
													href={Routes.version({
														version_id: this.version_id,
														serverLanguageTag
													})}
												>
													&nbsp;
													{ this.version_abbr }
												</a>
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
								this.refStrings
									&& this.refStrings.title
									&& (
										<a
											tabIndex={0}
											className='vertical-center'
											onClick={this.handleShare}
										>
											<ShareIcon fill='gray' />
										</a>
									),
								<OverflowMenu
									key='overflow'
									usfm={usfm}
									version_id={this.version_id}
									onEdit={onEdit}
									onDelete={onDelete}
								>
									{ overflowMenuChildren }
								</OverflowMenu>
							]}
						/>
					}
				>
					<a
						target='_self'
						href={Routes.reference({
							version_id: this.version_id,
							usfm: usfmString,
							version_abbr: this.version_abbr,
							serverLanguageTag
						})}
					>
						{ /* eslint-disable react/no-danger */ }
						<div
							className='reader'
							style={{ color: 'black' }}
							dangerouslySetInnerHTML={{ __html: verse }}
						/>
					</a>
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
	onShare: PropTypes.func,
	auth: PropTypes.object.isRequired,
	className: PropTypes.string,
	bible: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	hosts: PropTypes.object.isRequired,
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
	onShare: null,
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

export default connect(mapStateToProps, null)(ReferenceMoment)
