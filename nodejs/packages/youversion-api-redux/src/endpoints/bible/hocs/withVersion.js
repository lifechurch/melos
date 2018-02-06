import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import bibleActions from '../action'
import getBibleModel from '../../../models/bible'


function withVersionData(WrappedComponent) {
	class versionData extends Component {
		componentDidMount() {
			const { bibleModel } = this.props
			this.getVersion(this.versionId(), bibleModel)
		}

		componentWillReceiveProps(nextProps) {
			const { version_id } = this.props
			if ((version_id !== nextProps.version_id) && nextProps.version_id) {
				this.getVersion(nextProps.version_id, nextProps.bibleModel)
			}
		}

		getVersion = (version_id, bibleModel) => {
			const { dispatch, isParallel } = this.props
			const version = bibleModel
				&& bibleModel.pullVersion(version_id)
			const hasVersion = version && version.id
			const isLoading = version && version.loading

			if (!hasVersion && !isLoading) {
				dispatch(bibleActions({
					method: 'version',
					params: {
						id: version_id,
					},
					extras: {
						isParallel
					}
				})).then((data) => {
					if (data && data.id) {
						cookie.save(isParallel ? 'parallelVersion' : 'version', data.id, { path: '/' })
					}
				})
			}
		}

		versionId = () => {
			const { serverLanguageTag, version_id } = this.props
			return version_id || getBibleVersionFromStorage(serverLanguageTag)
		}

		render() {
			const { bibleModel } = this.props
			const version_id = this.versionId()
			const version = bibleModel.pullVersion(version_id)
			const language = version && version.language
			return (
				<WrappedComponent
					{...this.props}
					version={version}
					language_tag={language && language.language_tag}
					iso_639_1={language && language.iso_639_1}
				/>
			)
		}
	}

	versionData.propTypes = {
		bibleModel: PropTypes.object.isRequired,
		serverLanguageTag: PropTypes.string,
		version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		isParallel: PropTypes.bool,
		dispatch: PropTypes.func.isRequired,
	}

	versionData.defaultProps = {
		serverLanguageTag: 'en',
		isParallel: false,
	}

	function mapStateToProps(state) {
		return {
			bibleModel: getBibleModel(state),
			auth: state.auth,
			serverLanguageTag: state.serverLanguageTag
		}
	}

	return connect(mapStateToProps, null)(versionData)
}

export default withVersionData
