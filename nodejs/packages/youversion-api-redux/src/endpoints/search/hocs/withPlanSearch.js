import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import searchAction from '../action'
import getSearchModel from '../../../models/search'


function withPlanSearchData(WrappedComponent) {
	class searchData extends Component {
		componentDidMount() {
			const { plansSearchResults, query, dispatch, serverLanguageTag } = this.props
			if (!plansSearchResults) {
				dispatch(searchAction({
					method: 'reading_plans',
					params: {
						query,
						language_tag: serverLanguageTag,
					}
				}))
			}
		}

		render() {
			const { plansSearchResults } = this.props
			return (
				<WrappedComponent
					{...this.props}
					plansSearchResults={plansSearchResults}
				/>
			)
		}
	}

	searchData.propTypes = {
		plansSearchResults: PropTypes.object,
		query: PropTypes.string.isRequired,
		dispatch: PropTypes.func.isRequired,
		serverLanguageTag: PropTypes.string.isRequired,
	}

	searchData.defaultProps = {
		plansSearchResults: null,
	}

	function mapStateToProps(state, props) {
		const { query } = props
		return {
			plansSearchResults: getSearchModel(state)
				&& getSearchModel(state).plans
				&& getSearchModel(state).plans[query]
				&& getSearchModel(state).plans[query].reading_plans,
			serverLanguageTag: state.serverLanguageTag,
		}
	}

	return connect(mapStateToProps, null)(searchData)
}

export default withPlanSearchData
