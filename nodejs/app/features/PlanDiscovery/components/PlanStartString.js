import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'


function PlanStartString({ start_dt, dateOnly }) {
	const today = moment()
	const startDate = moment(start_dt, 'YYYY-MM-DD')
	const diff = today.diff(startDate, 'days')

	return (
		<div className='start-string'>
			{
				!dateOnly &&
				(
					diff >= 0
						? <FormattedMessage id='started' />
						: <FormattedMessage id='starts in' />
				)
			}
			{
				` ${moment().to(start_dt)} (${startDate.format('MMM D')})`
			}
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
