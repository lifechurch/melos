import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import CarouselArrow from '../../../components/Carousel/CarouselArrow'
import CalendarMonth from './CalendarMonth'


class Calendar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			activeMoment: moment(new Date())
		}
	}

	handleIncrementMonth = () => {
		this.setState((prevState) => {
			prevState.activeMoment.add('1', 'month')
		})
	}

	handleDecrementMonth = () => {
		this.setState((prevState) => {
			prevState.activeMoment.subtract('1', 'month')
		})
	}


	render() {

		const { showFullWeeks, data, children } = this.props
		const { activeMoment } = this.state

		const monthIndex = activeMoment.month()
		const year = activeMoment.year()

		return (
			<div className='calendar-container'>
				<div className='nav'>
					<div>
						<CarouselArrow
							onClick={this.handleDecrementMonth}
							dir='left'
							containerClass='arrow pointer'
							fill='black'
							width={20}
							height={20}
						/>
						<CarouselArrow
							onClick={this.handleIncrementMonth}
							dir='right'
							containerClass='arrow pointer'
							fill='black'
							width={20}
							height={20}
						/>
					</div>
				</div>
				<CalendarMonth
					monthNumber={monthIndex + 1}
					yearNumber={year}
					showFullWeeks={showFullWeeks}
					data={data}
				>
					{ children }
				</CalendarMonth>
			</div>
		)
	}
}

Calendar.propTypes = {
	children: PropTypes.func.isRequired,
	showFullWeeks: PropTypes.bool,
	data: PropTypes.object
}

Calendar.defaultProps = {
	showFullWeeks: true,
	data: {},
}

export default Calendar
