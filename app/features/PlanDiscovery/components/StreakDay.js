import React, { PropTypes } from 'react'
import { Link } from 'react-router'

function StreakDay(props) {
	const { date, complete, streak, link } = props
	const day = (
		<div className="streak-day">
			<div className={`streak-bar sd-${streak}`} />
			<div className={`sd-content sd-${complete}`}>
				<div>{date.getDate()}</div>
			</div>
		</div>
  )

	return (
    link !== null
      ? <Link to={link}>{day}</Link>
      : day
	)
}

StreakDay.propTypes = {
	date: PropTypes.object.isRequired,
	complete: PropTypes.oneOf(['Complete', 'Partial', 'Incomplete', 'None', 'Future']),
	streak: PropTypes.oneOf(['Beginning', 'Middle', 'End', 'None']),
	link: PropTypes.string
}

StreakDay.defaultProps = {
	date: new Date(),
	complete: 'None',
	streak: 'None',
	link: null
}

export default StreakDay
