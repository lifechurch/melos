import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import PopupMenu from '../../../components/PopupMenu'


function PlanMenu({ subscriptionLink, aboutLink, participantsLink, onCatchUp }) {
	return (
		<PopupMenu>
			<ul>
				{
					subscriptionLink
						&& (
							<Link to={`${subscriptionLink}`}>
								<li>
									<FormattedMessage id='plans.overview' />
								</li>
							</Link>
						)
				}
				{
					subscriptionLink
						&& (
							<Link to={`${subscriptionLink}/edit`}>
								<li>
									<FormattedMessage id='plans.settings' />
								</li>
							</Link>
						)
				}
				<Link to={`${aboutLink}`}>
					<li>
						<FormattedMessage id='features.EventEdit.features.preview.components.PreviewTypePlan.info' />
					</li>
				</Link>
				{
					subscriptionLink
						&& (
							<Link to={`${subscriptionLink}/calendar`}>
								<li>
									<FormattedMessage id='plans.month' />
								</li>
							</Link>
						)
				}
				{
					participantsLink
						&& (
							<Link to={participantsLink}>
								<li>
									<FormattedMessage id='participants' />
								</li>
							</Link>
						)
				}
				{
					onCatchUp
						&& (
							<a tabIndex={0} onClick={onCatchUp}>
								<li>
									<FormattedMessage id='plans.catch me up' />
								</li>
							</a>
						)
				}
			</ul>
		</PopupMenu>
	)
}

PlanMenu.propTypes = {
	aboutLink: PropTypes.string.isRequired,
	subscriptionLink: PropTypes.string,
	participantsLink: PropTypes.string,
	onCatchUp: PropTypes.func
}

PlanMenu.defaultProps = {
	subscriptionLink: null,
	participantsLink: null,
	onCatchUp: null,
}

export default PlanMenu
