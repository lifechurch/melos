import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import bibleActions from '../action'
import getBibleModel from '../../../models/bible'


function withVersionsData(WrappedComponent) {
	class versionData extends Component {
		constructor(props) {
			super(props)
			this.state = {
				language_tag: props.language_tag
			}
		}

		componentDidMount() {
			const { language_tag } = this.state
			this.getVersions(language_tag)
		}

		componentWillReceiveProps(nextProps) {
			const { language_tag } = this.state
			if (
				nextProps.language_tag
				&& nextProps.language_tag !== this.props.language_tag
				&& (language_tag !== nextProps.language_tag)
			) {
				this.getVersions(nextProps.language_tag)
			}
		}

		getVersions = (language_tag) => {
			const { dispatch, bibleModel } = this.props

			const hasVersions = bibleModel.versions
				&& bibleModel.versions.byLang
				&& bibleModel.versions.byLang[language_tag]
			if (!(hasVersions)) {
				dispatch(bibleActions({
					method: 'versions',
					params: {
						language_tag,
						type: 'all',
					}
				}))
			}
			if (language_tag) {
				this.setState({ language_tag })
			}
		}

		render() {
			const { bibleModel } = this.props
			const { language_tag } = this.state
			const versions = bibleModel.versions
				&& bibleModel.versions.byLang
				&& bibleModel.versions.byLang[language_tag]

			return (
				<WrappedComponent
					{...this.props}
					allVersions={versions && versions.all}
					versionsById={versions && versions.byId}
					selectedLanguage={language_tag}
					getVersions={this.getVersions}
				/>
			)
		}
	}

	versionData.propTypes = {
		language_tag: PropTypes.string,
		bibleModel: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
	}

	versionData.defaultProps = {
		language_tag: 'eng',
	}

	function mapStateToProps(state) {
		return {
			bibleModel: getBibleModel(state),
		}
	}

	return connect(mapStateToProps, null)(versionData)
}

export default withVersionsData
