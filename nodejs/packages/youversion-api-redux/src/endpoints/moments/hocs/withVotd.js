import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import momentsAction from '../action'
import getMomentsModel from '../../../models/moments'


function withVotdData(WrappedComponent) {
	class votdData extends Component {
		componentDidMount() {
			const { dispatch, momentsModel, iso_639_1 } = this.props
			const votd = momentsModel && momentsModel.votd
			const config = momentsModel && momentsModel.configuration
			if (!(config && config.images)) {
				dispatch(momentsAction({
					method: 'configuration'
				}))
			}
			if (!(votd && votd.length > 0)) {
				dispatch(momentsAction({
					method: 'votd',
					params: {
						language_tag: iso_639_1,
					}
				}))
			}
		}

		render() {
			const { momentsModel, iso_639_1 } = this.props

			const votd = momentsModel && momentsModel.votd
			const config = momentsModel && momentsModel.configuration
			const votdImagesWhitelist = config
				&& config.votd
				&& config.votd.iso_639_1
			const hasVotdImages = votdImagesWhitelist
				&& votdImagesWhitelist.includes(iso_639_1)
			return (
				<WrappedComponent
					{...this.props}
					votd={votd}
					hasVotdImages={hasVotdImages}
					imgSrcTemplate={config && config.images && config.images.verse_images.url}
				/>
			)
		}
	}

	votdData.propTypes = {
		momentsModel: PropTypes.object,
		dispatch: PropTypes.func.isRequired,
		iso_639_1: PropTypes.string,
	}

	votdData.defaultProps = {
		category: 'prerendered',
		momentsModel: null,
		iso_639_1: null
	}

	function mapStateToProps(state) {
		return {
			momentsModel: getMomentsModel(state),
			serverLanguageTag: state.serverLanguageTag,
		}
	}

	return connect(mapStateToProps, null)(votdData)
}

export default withVotdData
