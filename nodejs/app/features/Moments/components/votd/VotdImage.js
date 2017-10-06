import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import Immutable from 'immutable'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import imagesAction from '@youversion/api-redux/lib/endpoints/images/action'
import { getImages } from '@youversion/api-redux/lib/endpoints/images/reducer'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import LazyImage from '../../../../components/LazyImage'
import Slider from '../../../../components/Slider'
import { selectImageFromList } from '../../../../lib/imageUtil'

class VotdImage extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {
		const { moments, dayOfYear, images, dispatch, serverLanguageTag } = this.props
		if (!(moments && moments.pullVotd(dayOfYear) && moments.pullVotd(dayOfYear).image_id)) {
			dispatch(momentsAction({
				method: 'votd',
				params: {
					language_tag: serverLanguageTag,
				}
			})).then(() => {
				this.getImages()
			})
		} else {
			this.getImages()
		}
	}

	getImages = () => {
		const { dayOfYear, dispatch, serverLanguageTag, moments, images } = this.props
		if (!(images && false)) {
			dispatch(imagesAction({
				method: 'items',
				params: {
					language_tag: serverLanguageTag,
					category: 'prerendered',
					usfm: moments.pullVotd(dayOfYear).usfm,
				}
			}))
		}
	}

	render() {
		const { images, className } = this.props

		console.log(images)
		return (
			<div className={className}>
				<div><FormattedMessage id='votd image' /></div>
				<Slider childWidth={320}>
					{
						images
							&& images.length > 0
							&& images.map((img) => {
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
			</div>
		)
	}
}

VotdImage.propTypes = {
	className: PropTypes.string,
}

VotdImage.defaultProps = {
	className: 'card',
}

function mapStateToProps(state) {
	return {
		images: getImages(state),
		moments: getMomentsModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(VotdImage)
