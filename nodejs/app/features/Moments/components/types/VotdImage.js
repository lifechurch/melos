import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import withImages from '@youversion/api-redux/lib/endpoints/images/hocs/withImages'
import withVotd from '@youversion/api-redux/lib/endpoints/moments/hocs/withVotd'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import Routes from '@youversion/utils/lib/routes/routes'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'
import Moment from '../Moment'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'
import { Item } from '../../../../components/OverflowMenu'
import OverflowMenu from '../../../../widgets/OverflowMenu'
import VerseImagesSlider from '../../../../widgets/VerseImagesSlider'


function VotdImage(props) {
	const {
		dayOfYear,
		moments,
		className,
		serverLanguageTag,
		bible,
		usfm,
		hasNoImages,
		version_id,
		image_id,
		images,
	} = props

	const day = parseInt((dayOfYear || moment().dayOfYear()), 10)
	const usfmForImgs = usfm
		|| (
			moments.pullVotd(day)
			&& moments.pullVotd(day).usfm
		)
	const version = bible
		.pullVersion(version_id || getBibleVersionFromStorage(serverLanguageTag))
	const title = version
		&& version.books
		&& getReferencesTitle({
			bookList: version.books,
			usfmList: usfmForImgs,
		}).title

	let content = null
	if (image_id) {
		const img = images.filter((im) => {
			return parseInt(im.id, 10) === parseInt(image_id, 10)
		})[0]
		const src = img
			&& img.renditions
			&& img.renditions[img.renditions.length - 1].url

		content = (
			<div style={{ marginBottom: '10px', paddingRight: '20px' }}>
				<img alt='verse' src={src} />
			</div>
		)
	} else {
		content = (
			<VerseImagesSlider
				usfm={usfm}
				category='prerendered'
				linkBuilder={({ usfm: imgUsfm, id }) => {
					return Routes.votdImage({
						usfm: imgUsfm,
						id,
						serverLanguageTag,
						query: {
							version: version_id
						}
					})
				}}
			/>
		)
	}

	return (
		!hasNoImages
			&& (
				<div className={`yv-votd-image ${className}`}>
					<Moment
						header={
							<MomentHeader
								title={(
									<Heading3>
										{ title }
									</Heading3>
								)}
							/>
						}
						footer={
							<MomentFooter
								right={[
									<OverflowMenu
										key='overflow'
										usfm={usfmForImgs}
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
						{ content }
					</Moment>
				</div>
			)
	)
}

VotdImage.propTypes = {
	version_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	dayOfYear: PropTypes.number,
	usfm: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	className: PropTypes.string,
	moments: PropTypes.object.isRequired,
	bible: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	hasNoImages: PropTypes.bool,
	image_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

VotdImage.defaultProps = {
	version_id: null,
	dayOfYear: null,
	usfm: null,
	hasNoImages: false,
	className: '',
	image_id: null,
}

function mapStateToProps(state) {
	return {
		moments: getMomentsModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(withVotd(withImages(VotdImage)))
