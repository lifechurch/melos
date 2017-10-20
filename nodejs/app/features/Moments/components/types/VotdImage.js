import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import VerseImagesSlider from '../../../../widgets/VerseImagesSlider'


class VotdImage extends Component {
	constructor(props) {
		super(props)
		const { dayOfYear } = this.props
		this.dayOfYear = parseInt((dayOfYear || moment().dayOfYear()), 10)
	}

	componentDidMount() {
		const { moments, dispatch, serverLanguageTag } = this.props
		if (!(moments && moments.pullVotd(this.dayOfYear) && moments.pullVotd(this.dayOfYear).image_id)) {
			dispatch(momentsAction({
				method: 'votd',
				params: {
					language_tag: serverLanguageTag,
				}
			}))
		}
	}

	render() {
		const { moments, className } = this.props

		const usfm = moments.pullVotd(this.dayOfYear)
			&& moments.pullVotd(this.dayOfYear).usfm
		return (
			usfm
				&& (
					<VerseImagesSlider className={className} usfm={usfm} />
				)
		)
	}
}

VotdImage.propTypes = {
	dayOfYear: PropTypes.number,
	className: PropTypes.string,
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
		moments: getMomentsModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(VotdImage)
