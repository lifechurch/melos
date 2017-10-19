import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import imagesAction from '@youversion/api-redux/lib/endpoints/images/action'
import getImagesModel from '@youversion/api-redux/lib/models/images'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import LazyImage from '../components/LazyImage'
import Slider from '../components/Slider'
import Button from '../components/Button'
import StackedContainer from '../components/StackedContainer'
import { selectImageFromList, PLAN_DEFAULT } from '../lib/imageUtil'
import { getBibleVersionFromStorage } from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import Moment from '../features/Moments/components/Moment'
import MomentHeader from '../features/Moments/components/MomentHeader'
import MomentFooter from '../features/Moments/components/MomentFooter'
import Routes from '../lib/routes'
import { Item } from '../components/OverflowMenu'
import OverflowMenu from '../widgets/OverflowMenu'


class VerseImagesSlider extends Component {
	componentDidMount() {
		const { serverLanguageTag } = this.props
		this.version_id = getBibleVersionFromStorage(serverLanguageTag)
		if (!this.hasImages() && this.versionData()) {
			this.getImages()
		}
	}

	componentDidUpdate(prevProps) {
		const version = this.versionData()
		const prevVersion = prevProps
			&& prevProps.bible
			&& prevProps.bible.versions
			&& prevProps.bible.versions.byId
			&& prevProps.bible.versions.byId[this.version_id]
			&& prevProps.bible.versions.byId[this.version_id].response
			? prevProps.bible.versions.byId[this.version_id].response
			: null
		if (
			!this.hasImages()
			&& version
			&& !prevVersion
			&& (!!version !== !!prevVersion)
		) {
			this.getImages()
		}
	}

	getImages = () => {
		const { dispatch, usfm } = this.props
		const version = this.versionData()
		if (version) {
			dispatch(imagesAction({
				method: 'items',
				params: {
					language_tag: version.language.iso_639_1,
					category: 'prerendered',
					usfm,
				}
			}))
		}
	}

	hasImages = () => {
		const { images, usfm } = this.props
		const version = this.versionData()
		return images
			&& images.filter({
				category: 'prerendered',
				usfm,
				language_tag: version && version.language.iso_639_1
			}).length > 0
	}

	versionData = () => {
		const { bible } = this.props
		return bible
			&& bible.versions
			&& bible.versions.byId
			&& bible.versions.byId[this.version_id]
			&& bible.versions.byId[this.version_id].response
			? bible.versions.byId[this.version_id].response
			: null
	}

	render() {
		const { usfm, images, className, serverLanguageTag } = this.props

		const version = this.versionData()
		const title = version
			&& version.books
			&& getReferencesTitle({
				bookList: version.books,
				usfmList: usfm,
			}).title
		const matchedImages = images
			&& images.filter({
				category: 'prerendered',
				usfm,
				language_tag: version && version.language.iso_639_1
			})
		const imagesToRender = matchedImages
			&& matchedImages.map((img) => {
				const src = selectImageFromList({
					images: img.renditions,
					width: 640,
					height: 640,
				}).url
				return (
					<LazyImage
						key={img.id}
						src={src}
						width={320}
						height={320}
					/>
				)
			})

		if (matchedImages.length === 0) return null
		return (
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
									version_id={version && version.id}
								>
									<Item link={Routes.notificationsEdit({ serverLanguageTag })}>
										<FormattedMessage id='notification settings' />
									</Item>
								</OverflowMenu>
							]}
						/>
					}
				>
					<Slider>
						{ imagesToRender }
						<StackedContainer>
							<LazyImage
								key='sub'
								src={PLAN_DEFAULT}
								width={320}
								height={320}
							/>
							<div className='vertical-center horizontal-center' style={{ height: '100%', width: '100%' }}>
								<Button to='/vod_subscriptions' className='green' useClientRouting={false}>
									<FormattedMessage id='votd notifications prompt' />
								</Button>
							</div>
						</StackedContainer>
					</Slider>
				</Moment>
			</div>
		)
	}
}

VerseImagesSlider.propTypes = {
	usfm: PropTypes.string,
	bible: PropTypes.object,
	className: PropTypes.string,
	images: PropTypes.array,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

VerseImagesSlider.defaultProps = {
	usfm: null,
	bible: null,
	images: null,
	className: '',
}

function mapStateToProps(state) {
	return {
		images: getImagesModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(VerseImagesSlider)
