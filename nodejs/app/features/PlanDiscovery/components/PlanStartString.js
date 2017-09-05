import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import calcTodayVsStartDt from '../../../lib/calcTodayVsStartDt'


function PlanStartString({ start_dt, dateOnly }) {
	const {
		isInFuture,
		string
	} = calcTodayVsStartDt(start_dt)

	return (
		<div className='start-string' style={{ display: 'inline-block' }}>
			{
				!dateOnly &&
				(
					isInFuture
						? <FormattedMessage id='starts' />
						: <FormattedMessage id='started' />
				)
			}
			{ ` ${string}` }
		</div>
	)
}

PlanStartString.propTypes = {
	start_dt: PropTypes.string.isRequired,
	dateOnly: PropTypes.bool,
}

PlanStartString.defaultProps = {
	dateOnly: false,
}

export default PlanStartString
