import React, { Component } from 'react'
import { connect } from 'react-redux'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import AboutPlan from '../features/PlanDiscovery/components/AboutPlan'

class AboutPlanView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isSubscribed: false,
		}
	}
	componentDidMount() {
		const { dispatch, readingPlan, auth } = this.props
		if (auth && auth.isLoggedIn) {
			dispatch(plansAPI.actions.subscriptions.get({
				page: '*',
				fields: 'id,plan_id',
			}, { auth: true })).then((data) => {
				if (data && data.data) {
					this.setState({
						isSubscribed: data
						&& data.data
						&& Object.keys(data.data).some((sub_id) => {
							const sub = data.data[sub_id]
							if (readingPlan && readingPlan.id && sub.plan_id) {
								return parseInt(sub.plan_id, 10) === parseInt(readingPlan.id, 10)
							}
							return false
						})
					})
				}
			})
		}
	}

	render() {
		const { isSubscribed } = this.state
		return (
			<AboutPlan {...this.props} isSubscribed={isSubscribed} />
		)
	}
}

function mapStateToProps(state) {
	return {
		imageConfig: (state.plansDiscovery && state.plansDiscovery.configuration && state.plansDiscovery.configuration.images) ? state.plansDiscovery.configuration.images : {},
		readingPlan: (state.plansDiscovery && state.plansDiscovery.plans) ? state.plansDiscovery.plans : null,
		recommendedPlans: state.readingPlans && state.readingPlans.recommendedPlans ? state.readingPlans.recommendedPlans : null,
		savedPlans: state.readingPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
		auth: (state.auth),
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(AboutPlanView)
