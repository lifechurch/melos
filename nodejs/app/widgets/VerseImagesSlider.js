import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import imagesAction from '@youversion/api-redux/lib/endpoints/images/action'
import getImagesModel from '@youversion/api-redux/lib/models/images'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import LazyImage from '../components/LazyImage'
import Slider from '../components/Slider'
import { selectImageFromList } from '../lib/imageUtil'
import { getBibleVersionFromStorage } from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import Moment from '../features/Moments/components/Moment'
import MomentHeader from '../features/Moments/components/MomentHeader'
import MomentFooter from '../features/Moments/components/MomentFooter'


class VerseImagesSlider extends Component {
	componentDidMount() {
		const { usfm, images, serverLanguageTag } = this.props

		const matchedImages = images
			&& images.filter({
				category: 'prerendered',
				usfm,
				language_tag: serverLanguageTag
			}).length > 0
		if (!matchedImages) {
			this.getImages()
		}
	}

	getImages = () => {
		const { dispatch, serverLanguageTag, usfm } = this.props
		dispatch(imagesAction({
			method: 'items',
			params: {
				language_tag: serverLanguageTag,
				category: 'prerendered',
				usfm,
			}
		}))
	}

	render() {
		const { usfm, images, className, serverLanguageTag, bible } = this.props

		const matchedImages = images
			&& images.filter({
				category: 'prerendered',
				usfm,
				language_tag: serverLanguageTag
			})
		const versionData = bible
			&& bible.versions
			&& bible.versions.byId
			&& bible.versions.byId[getBibleVersionFromStorage()]
			&& bible.versions.byId[getBibleVersionFromStorage()].response
		const title = versionData
			&& versionData.books
			&& getReferencesTitle({
				bookList: versionData.books,
				usfmList: usfm,
			}).title
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
							right={'footee'}
						/>
					}
				>
					<Slider>
						{
							matchedImages
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
						}
					</Slider>
				</Moment>
			</div>
		)
	}
}

VerseImagesSlider.propTypes = {
	usfm: PropTypes.string,
	className: PropTypes.string,
	images: PropTypes.array,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

VerseImagesSlider.defaultProps = {
	usfm: null,
	images: null,
	className: '',
}

function mapStateToProps(state) {
	console.log('IMAGES', getImagesModel(state))
	return {
		images: getImagesModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(VerseImagesSlider)
