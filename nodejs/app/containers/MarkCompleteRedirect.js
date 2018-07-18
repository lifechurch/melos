import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import { FormattedMessage } from 'react-intl'
import plansAction from '@youversion/api-redux/lib/endpoints/plans'
import subscriptionData from '@youversion/api-redux/lib/batchedActions/subscriptionData'
import getCurrentDT from '@youversion/utils/lib/time/getCurrentDT'
import Routes from '@youversion/utils/lib/routes/routes'


class MarkCompleteRedirect extends Component {
	componentDidMount() {
		const { dispatch, params: { id, slug, subscription_id, day }, auth, serverLanguageTag } = this.props
		this.username = auth && auth.userData && auth.userData.username

		const signin = Routes.signIn({
			query: {
				redirect: window.location.pathname
			}
		})
		if (!auth.isLoggedIn) {
			window.location.replace(signin)
		} else if (subscription_id) {
			dispatch(subscriptionData({ subscription_id, auth, day, serverLanguageTag }))
			dispatch(plansAction.actions.progressDay.put({
				id: subscription_id,
				day
			}, {
				body: {
					complete: true,
					updated_dt: getCurrentDT(),
				},
				auth: true,
			})).then(() => {
				dispatch(push(Routes.subscriptionDayComplete({
					username: this.username,
					subscription_id,
					day,
					plan_id: id,
					slug,
					serverLanguageTag,
				})))
			})
		}
	}

	// in case the redirect fails for some reason, give the user the option to view plans
	render() {
		return (
			<div className='plan-reader-content horizontal-center flex-wrap centered large-6 small-10'>
				<h3 className='text-center' style={{ width: '100%' }}>
					<FormattedMessage id='redirecting' style={{ width: '100%' }} />
				</h3>
				<Link to={Routes.subscriptions({ username: this.username })} target='_self'>
					<button className='chapter-button'>
						<FormattedMessage id='plans.my plans' />
					</button>
				</Link>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts
	}
}

MarkCompleteRedirect.propTypes = {
	auth: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

MarkCompleteRedirect.defaultProps = {

}

export default connect(mapStateToProps, null)(MarkCompleteRedirect)
