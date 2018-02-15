import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

function CalendarDay(props) {
	const { date, link, customClass, handleClick, disabled } = props
	const day = (
		<div className={`calendar-day ${customClass} ${disabled ? 'disabled' : ''}`}>
			<div>{ date }</div>
		</div>
  )

	let content = day
	if (link) {
		content = <Link to={link}>{ day }</Link>
	} else if (handleClick && !disabled) {
		content = <div onClick={handleClick}>{ day }</div>
	}

	return (
    content
	)
}

CalendarDay.propTypes = {
	date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	link: PropTypes.string,
	handleClick: PropTypes.func,
	customClass: PropTypes.string,
	disabled: PropTypes.bool,
}

CalendarDay.defaultProps = {
	link: null,
	handleClick: null,
	customClass: '',
	disabled: false,
}

export default CalendarDay
