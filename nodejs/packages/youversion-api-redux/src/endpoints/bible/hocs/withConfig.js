import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import bibleActions from '../action'
import getBibleModel from '../../../models/bible'


function withConfigData(WrappedComponent) {
	class configData extends Component {
		componentDidMount() {
			const { dispatch, bibleModel } = this.props
			if (!(bibleModel && bibleModel.languages && bibleModel.languages.all)) {
				dispatch(bibleActions({ method: 'configuration' }))
			}
		}

		render() {
			const { bibleModel } = this.props
			const langs = bibleModel.languages

			return (
				<WrappedComponent
					{...this.props}
					languages={langs && langs.all}
					languageMap={langs && langs.map}
				/>
			)
		}
	}

	configData.propTypes = {
		bibleModel: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
	}

	configData.defaultProps = {

	}

	function mapStateToProps(state) {
		return {
			bibleModel: getBibleModel(state),
		}
	}

	return connect(mapStateToProps, null)(configData)
}

export default withConfigData
