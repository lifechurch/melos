import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import CreatePWF from '../features/PlanDiscovery/components/CreatePWF'
import { selectImageFromList } from '../lib/imageUtil'
import Routes from '../lib/routes'

class CreatePWFView extends Component {
	componentDidMount() {
		const { dispatch, params: { id } } = this.props
		dispatch(readingPlansAction({
			method: 'view',
			params: {
				id: id.split('-')[0],
			},
		}))
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
		// make api call and render new view
		dispatch(plansAPI.actions.subscriptions.post({}, {
			body: {
				created_dt: selectedDay,
				plan_id,
				together: true,
				language_tag: serverLanguageTag,
			},
			auth: auth.isLoggedIn,
		})).then((data) => {
			if (data && 'id' in data) {
				dispatch(routeActions.push(Routes.togetherInvite({
					username: auth.userData.username,
					plan_id,
					slug: id.split('-')[1],
					together_id: data.together_id
				})))
			}
		})
	}

	render() {
		const { plan } = this.props

		const src = plan && plan.images
			? selectImageFromList({
				images: plan.images,
				width: 720,
				height: 405
			}).url
			: null

		return (
			<CreatePWF
				backPath={null}
				planImgSrc={src}
				onHandleSubscribe={this.handleSubscribe}
			/>
		)
	}
}


function mapStateToProps(state, props) {
	const { params: { id } } = props
	return {
		plan: getPlanById(state, id.split('-')[0]),
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

CreatePWFView.propTypes = {
	plan: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, null)(CreatePWFView)
