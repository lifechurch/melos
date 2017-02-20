import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

function PlanDayStartButton(props) {
	const { link } = props
	return (
		<Link className="solid-button green" to={link}>
			<FormattedMessage id="plans.widget.start reading" />
		</Link>
	)
}

PlanDayStartButton.propTypes = {
	link: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default PlanDayStartButton
