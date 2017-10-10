import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import imagesAction from '@youversion/api-redux/lib/endpoints/images/action'
import { getImages } from '@youversion/api-redux/lib/endpoints/images/reducer'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import LazyImage from '../../../../components/LazyImage'
import Slider from '../../../../components/Slider'
import Moment from '../Moment'
import MomentHeader from '../MomentHeader'
import MomentFooter from '../MomentFooter'
import { selectImageFromList } from '../../../../lib/imageUtil'


class VotdImage extends Component {
	constructor(props) {
		super(props)
		const { dayOfYear } = this.props
		this.dayOfYear = parseInt(dayOfYear || moment().dayOfYear(), 10)
	}

	componentDidMount() {
		const { moments, dispatch, serverLanguageTag } = this.props
		if (!(moments && moments.pullVotd(this.dayOfYear) && moments.pullVotd(this.dayOfYear).image_id)) {
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
		const { dispatch, serverLanguageTag, moments, images } = this.props
		if (!(images && false)) {
			dispatch(imagesAction({
				method: 'items',
				params: {
					language_tag: serverLanguageTag,
					category: 'prerendered',
					usfm: moments.pullVotd(this.dayOfYear).usfm,
				}
			}))
		}
	}

	render() {
		const { images, className } = this.props

		return (
			<div className={`yv-votd-image ${className}`}>
				<Moment
					header={
						<MomentHeader
							title={
								<FormattedMessage id='votd image' />
							}
						/>
					}
					footer={
						<MomentFooter
							right={'footee'}
						/>
					}
				>
					{
						images
						&& images.length > 0
						&& (
							<Slider>
								{
									images.map((img) => {
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
						)
					}
				</Moment>
			</div>
		)
	}
}

VotdImage.propTypes = {
	dayOfYear: PropTypes.number,
	className: PropTypes.string,
	images: PropTypes.array,
	moments: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

VotdImage.defaultProps = {
	dayOfYear: null,
	images: null,
	className: '',
}

function mapStateToProps(state) {
	return {
		images: getImages(state),
		moments: getMomentsModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(VotdImage)
