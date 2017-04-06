import React, { Component, PropTypes } from 'react'
import PlanListItem from './PlanListItem'
import { injectIntl, FormattedMessage } from 'react-intl'
import Waypoint from 'react-waypoint'
import { Link } from 'react-router'

class PlanList extends Component {
	constructor(props) {
		super(props)
		this.loadMore = ::this.loadMore
	}

	loadMore() {
		const { plans: { nextPage }, loadMore } = this.props
		if (nextPage !== null && typeof loadMore === 'function') {
			loadMore(nextPage)
		}
 	}

	render() {
		const { plans, title, listType, serverLanguageTag, params, auth, localizedLink } = this.props

		const items = plans.items.map((plan) => {
			if (typeof plan === 'object') {
				return (
					<PlanListItem
						serverLanguageTag={serverLanguageTag}
						listType={listType}
						key={plan.id}
						plan={plan}
						params={params}
						auth={auth}
						localizedLink={localizedLink}
					/>
				)
			} else {
				return null
			}
		})

		let backButton = <span>&nbsp;</span>
		if (listType !== 'Subscribed') {
			backButton = <Link to={localizedLink(`/users/${auth.userData.username}/reading-plans`)}>&larr; <FormattedMessage id="plans.back" /></Link>
		}

		let savedLink
		if (listType !== 'Saved') {
			savedLink = <Link to={localizedLink(`/users/${auth.userData.username}/saved-reading-plans`)}><FormattedMessage id="plans.saved plans" /></Link>
		} else {
			savedLink = <FormattedMessage id="plans.saved plans" />
		}

		let completedLink = <span>&nbsp;</span>
		if (listType !== 'Completed') {
			completedLink = <Link to={localizedLink(`/users/${auth.userData.username}/completed-reading-plans`)}><FormattedMessage id="plans.completed plans" /></Link>
		} else {
			completedLink = <FormattedMessage id="plans.completed plans" />
		}

		return (
			<div>
				<div className="row collapse">
					<div className="columns large-8 medium-8 medium-centered">
						<div className="row collapse plan-title-row">
							<div className="columns small-2">
								{backButton}
							</div>
							<div className="column small-8 end text-center">
								<div className="plan-saved-title">{title}</div>
							</div>
						</div>
					</div>
				</div>
				<article>
					<div className="row collapse">
						<div className="columns large-8 medium-8 medium-centered subscription-list">
							{items}
							<div><Waypoint onEnter={this.loadMore} /></div>
						</div>
					</div>
					<div className="row collapse">
						<div className="columns large-8 medium-8 medium-centered subscription-actions">
							<div className="left">
								{savedLink}
							</div>
							<div className="right">
								{completedLink}
							</div>
						</div>
					</div>
				</article>
			</div>
		)
	}
}

PlanList.propTypes = {
	plans: PropTypes.object.isRequired,
	loadMore: PropTypes.func,
	listType: PropTypes.oneOf(['Subscribed', 'Saved', 'Completed']),
	title: PropTypes.node
}

PlanList.defaultProps = {
	plans: [],
	listType: 'Subscribed'
}

export default injectIntl(PlanList)
