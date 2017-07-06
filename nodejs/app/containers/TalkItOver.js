import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
// actions
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import plansAPI, { getTogether } from '@youversion/api-redux/lib/endpoints/plans'
// models
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
// selectors
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
// utils
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'
// components


class TalkItOver extends Component {
	componentDidMount() {

	}

	render() {
		const { content, day } = this.props

		return (
			<div className='gray-background'>
				{ content }
			</div>
		)
	}
}


function mapStateToProps(state, props) {
	// const { params: { id, together_id } } = props
	// const plan_id = id ? id.split('-')[0] : null
	// return {
	// 	plan: getPlanById(state, plan_id),
	// 	participantsUsers: getParticipantsUsersByTogetherId(state, together_id),
	// 	together: getTogether(state),
	// 	auth: state.auth,
	// 	serverLanguageTag: state.serverLanguageTag
	// }
}

TalkItOver.propTypes = {

}

TalkItOver.defaultProps = {
	location: {},
}

export default connect(mapStateToProps, null)(TalkItOver)
