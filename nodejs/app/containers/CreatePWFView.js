import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { push } from 'react-router-redux'
import getSubscriptionModel from '@youversion/api-redux/lib/models/subscriptions'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import subscribeToPlan from '@youversion/api-redux/lib/batchedActions/subscribeToPlan'
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import CreatePWF from '../features/PlanDiscovery/components/CreatePWF'
import Routes from '@youversion/utils/lib/routes/routes'

function getSubId(props) {
	return props.location
		&& props.location.query
		&& props.location.query.subscription_id
}

class CreatePWFView extends Component {
	constructor(props) {
		super(props)
		this.subscription_id = getSubId(props)
	}

	componentDidMount() {
		const { dispatch, params: { id }, plan } = this.props
		if (!plan) {
			dispatch(readingPlansAction({
				method: 'view',
				params: {
					id: id.split('-')[0],
				},
			}))
		}
	}

	localizedLink = (link) => {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	handleSubscribe = (selectedDay) => {
		const { dispatch, auth, params: { id }, serverLanguageTag } = this.props
		const plan_id = id ? id.split('-')[0] : null
		// editing start date
		if (this.subscription_id) {
			dispatch(plansAPI.actions.subscription.put({
				id: this.subscription_id
			}, {
				body: {
					start_dt: moment(selectedDay).utc().format(),
				},
				auth: auth.isLoggedIn,
			})).then(() => {
				dispatch(push(Routes.subscriptions({
					username: auth.userData.username,
				})))
			})
		// creating plan with friends date
		} else {
			dispatch(subscribeToPlan({
				start_dt: moment(selectedDay).utc().format(),
				plan_id,
				isTogether: true,
				privacy: 'private',
				serverLanguageTag,
				auth: auth.isLoggedIn,
				onComplete: (sub) => {
					if (sub && sub.together_id) {
						dispatch(push(Routes.togetherInvite({
							username: auth.userData.username,
							plan_id,
							together_id: sub.together_id
						})))
					}
				}
			}))
		}
	}

	render() {
		const { plan, subscription } = this.props

		const src = plan && plan.images
			? selectImageFromList({
				images: plan.images,
				width: 720,
				height: 405
			}).url
			: null
		const backPath = plan
			&& 'id' in plan
			&& Routes.plan({
				plan_id: plan.id,
				slug: plan.slug,
			})

		return (
			<CreatePWF
				backPath={backPath}
				planImgSrc={src}
				onHandleSubscribe={this.handleSubscribe}
				isEditingDate={!!this.subscription_id}
				initialDay={subscription && subscription.start_dt}
			/>
		)
	}
}


function mapStateToProps(state, props) {
	const { params: { id } } = props
	const subscription_id = getSubId(props)
	return {
		plan: getPlanById(state, id.split('-')[0]),
		subscription: getSubscriptionModel(state) && subscription_id in getSubscriptionModel(state).byId
			? getSubscriptionModel(state).byId[subscription_id]
			: null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

CreatePWFView.propTypes = {
	plan: PropTypes.object.isRequired,
	subscription: PropTypes.object,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

CreatePWFView.defaultProps = {
	subscription: null,
}

export default connect(mapStateToProps, null)(CreatePWFView)
