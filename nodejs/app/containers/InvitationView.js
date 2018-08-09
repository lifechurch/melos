import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Helmet from 'react-helmet'
import { FormattedMessage, injectIntl } from 'react-intl'
// actions
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import plansAPI from '@youversion/api-redux/lib/endpoints/plans'
// models
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
// selectors
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
// utils
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
// components
import TogetherInvitation from '../features/PlanDiscovery/components/TogetherInvitation'
import PlanStartString from '../features/PlanDiscovery/components/PlanStartString'


class InvitationView extends Component {
	componentDidMount() {
		const {
			dispatch,
			params: { id, together_id },
			auth,
			location: { query },
			plan,
			participants,
			serverLanguageTag
		} = this.props
		// join token will allow us to see the participants and together unauthed
		if (!(plan && participants && participants.filter({ together_id, idOnly: true }).length > 0)) {
			dispatch(planView({
				plan_id: id.split('-')[0],
				together_id,
				token: query && query.token,
				auth,
				serverLanguageTag
			}))
			dispatch(plansAPI.actions.together.get({
				id: together_id,
				token: query && query.token
			}, { auth: auth && auth.isLoggedIn })).then((data) => {
				if (!(data && data.data)) {
					this.onUnauthedAction()
				}
			})
		}
	}

	onActionComplete = () => {
		const { auth, dispatch } = this.props
		if (auth.isLoggedIn) {
			dispatch(push(Routes.subscriptions({
				username: auth.userData.username
			})))
		} else if (window) {
			window.location.href = Routes.signIn({
				query: {
					redirect: window.location.href
				}
			})
		}
	}

	onUnauthedAction = () => {
		// redirect to sign up
		if (window) {
			window.location.href = Routes.signUp({
				query: {
					redirect: window.location.href
				}
			})
		}
	}

	render() {
		const { plan, params: { together_id }, location: { query }, together, participants, hosts, serverLanguageTag, intl } = this.props
		this.joinToken = query && query.token
		const isFromShareLink = query.source && query.source === 'share'
		const planImg = plan
			? selectImageFromList({ images: plan.images, width: 640, height: 320 }).url
			: ''
		const planTitle = plan ? plan.name.default : null
		const planLink = plan ? plan.short_url : null
		const invitedNum = participants
			&& participants.filter({ together_id, statusFilter: 'invited', idOnly: true })
			? participants.filter({ together_id, statusFilter: 'invited', idOnly: true }).length
			: 0
		const acceptedNum = participants
			&& participants.filter({ together_id, statusFilter: ['host', 'accepted'], idOnly: true })
			? participants.filter({ together_id, statusFilter: ['host', 'accepted'], idOnly: true }).length
			: 0
		const hostObj = participants
			&& participants.filter({ together_id, statusFilter: 'host' })
		const host = hostObj
			&& hostObj[Object.keys(hostObj)[0]]
			&& hostObj[Object.keys(hostObj)[0]].name
		const title = planTitle
		const description = intl.formatMessage({ id: 'join together' }, { host })
		const url = `${hosts && hosts.railsHost}${Routes.togetherInvitation({
			plan_id: plan && plan.id,
			slug: plan && plan.slug,
			together_id,
			serverLanguageTag,
			query: {
				token: together && together.token,
			}
		})}`

		return (
			<div>
				<Helmet
					title={title}
					meta={[
						{ name: 'description', content: description },
						{ property: 'og:title', content: title },
						{ property: 'og:url', content: url },
						{ property: 'og:description', content: description },
						{ name: 'twitter:card', content: 'summary_large_image' },
						{ name: 'twitter:url', content: url },
						{ name: 'twitter:title', content: title },
						{ name: 'twitter:description', content: description },
						{ name: 'twitter:site', content: '@YouVersion' },
						{ property: 'og:image', content: `https:${planImg}` },
						{ property: 'og:image:width', content: 720 },
						{ property: 'og:image:height', content: 402 },
						{ name: 'twitter:image', content: `https:${planImg}` }
					]}
				/>
				<TogetherInvitation
					together_id={together_id}
					planImg={planImg}
					planTitle={planTitle}
					planLink={planLink}
					participantsString={
						<div>
							{
								invitedNum > 1
									? <FormattedMessage id='x pending.other' values={{ number: invitedNum }} />
									: <FormattedMessage id='x pending.one' values={{ number: invitedNum }} />
							}
							&nbsp;
							&bull;
							&nbsp;
							{
								acceptedNum > 1
									? <FormattedMessage id='x accepted.other' values={{ number: acceptedNum }} />
									: <FormattedMessage id='x accepted.one' values={{ number: acceptedNum }} />
							}
						</div>
					}
					startDate={<PlanStartString start_dt={together && together.start_dt} dateOnly />}
					joinToken={this.joinToken}
					showDecline={!isFromShareLink}
					handleActionComplete={this.onActionComplete}
					handleUnauthed={this.onUnauthedAction}
				/>
			</div>
		)
	}
}


function mapStateToProps(state, props) {
	const { params: { id, together_id } } = props
	const plan_id = id ? id.split('-')[0] : null
	return {
		plan: getPlanById(state, plan_id),
		participants: getParticipantsUsers(state),
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts
	}
}

InvitationView.propTypes = {
	plan: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	participants: PropTypes.object.isRequired,
	together: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	location: PropTypes.object,
	hosts: PropTypes.object.isRequired,
	intl: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

InvitationView.defaultProps = {
	location: {},
}

export default connect(mapStateToProps, null)(injectIntl(InvitationView))
