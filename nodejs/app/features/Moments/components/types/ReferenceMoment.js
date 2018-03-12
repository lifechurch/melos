import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import withReferenceData from '@youversion/api-redux/lib/endpoints/bible/hocs/withReference'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'
import Routes from '@youversion/utils/lib/routes/routes'
import shareAction from '../../../../widgets/ShareSheet/action'
import Like from '../../../../components/Like'
import ShareIcon from '../../../../components/icons/ShareIcon'
import OverflowMenu from '../../../../widgets/OverflowMenu'
import Moment from '../Moment'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'
import Placeholder from '../../../../components/placeholders/buildingBlocks/Placeholder'
import PlaceholderText from '../../../../components/placeholders/buildingBlocks/PlaceholderText'


class ReferenceMoment extends Component {
	handleShare = () => {
		const { dispatch, hosts, onShare, text, referenceLink, referenceTitle } = this.props
		if (onShare && typeof onShare === 'function') {
			onShare({ refTitle: referenceTitle, refText: text })
		} else {
			dispatch(shareAction({
				isOpen: true,
				text,
				url: `${hosts && hosts.railsHost}${referenceLink}`,
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
			serverLanguageTag,
			auth,
			referenceTitle,
			chapterLink,
			referenceLink,
			versionId,
			versionAbbr,
			html,
			leftFooter,
			noContentAvailable
		} = this.props

		const footerLeft = []
		if (onLike) {
			footerLeft.push(
				<Like
					onClick={onLike}
					isFilled={likedIds
						&& auth.userData
						&& likedIds.includes(auth.userData.userid)
					}
				/>
			)
		}
		if (onComment) {
			footerLeft.push(
				<Comment onClick={onComment} />
			)
		}
		if (leftFooter) {
			footerLeft.push([ ...leftFooter ])
		}

		const htmlOrLoader = html
			? (
				<a
					target='_self'
					href={referenceLink}
				>
					{ /* eslint-disable react/no-danger */ }
					<div
						className='reader'
						style={{ color: 'black' }}
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				</a>
			)
			: (
				<Placeholder height='110px'>
					<PlaceholderText
						className='flex'
						lineSpacing='15px'
						textHeight='16px'
						widthRange={[20, 100]}
					/>
				</Placeholder>
			)
		const content = noContentAvailable
			? <FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
			: htmlOrLoader

		return (
			<div className={`yv-votd-text ${className}`}>
				<Moment
					header={
						<MomentHeader
							icon={icon}
							title={
								<div className='vertical-center flex-wrap'>
									{ title }
									<Heading3>
										{
											referenceTitle
												&& (
													<a
														target='_self'
														href={chapterLink}
													>
														{ referenceTitle }
													</a>
												)
										}
										{
											versionAbbr
												&& (
													<a
														target='_self'
														href={Routes.version({
															version_id: versionId,
															serverLanguageTag
														})}
													>
														&nbsp;
														{ versionAbbr }
													</a>
												)
										}
									</Heading3>
								</div>
							}
						/>
					}
					likedIds={likedIds}
					commentIds={commentIds}
					footer={
						<MomentFooter
							left={footerLeft}
							right={[
								referenceTitle
									&& (
										<a
											title='Share'
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
									version_id={versionId}
									onEdit={onEdit}
									onDelete={onDelete}
								>
									{ overflowMenuChildren }
								</OverflowMenu>
							]}
						/>
					}
				>
					{ content }
				</Moment>
			</div>
		)
	}
}

ReferenceMoment.propTypes = {
	usfm: PropTypes.array.isRequired,
	icon: PropTypes.node,
	title: PropTypes.node,
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
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	hosts: PropTypes.object.isRequired,
	referenceTitle: PropTypes.string.isRequired,
	chapterLink: PropTypes.string.isRequired,
	referenceLink: PropTypes.string.isRequired,
	versionId: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
	versionAbbr: PropTypes.string.isRequired,
	html: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	leftFooter: PropTypes.array,
	noContentAvailable: PropTypes.bool,
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
	leftFooter: null,
	overflowMenuChildren: null,
	noContentAvailable: false,
}

function mapStateToProps(state) {
	return {
		moments: getMomentsModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
		auth: state.auth,
	}
}

export default connect(mapStateToProps, null)(withReferenceData(ReferenceMoment))
