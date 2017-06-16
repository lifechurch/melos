import React, { PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { dayHasDevo } from '../../../lib/readingPlanUtils'

function PlanStartString({ start_dt }) {
	let string = null
	const today = moment()
	const startDate = moment(start_dt, 'YYYY-MM-DD')
	const diff = today.diff(startDate, 'days')
	console.log('DOFF', diff);
	string = <div />
	return (
		string
	)
}

PlanStartString.propTypes = {
	start_dt: PropTypes.string.isRequired,
}

export default PlanStartString
