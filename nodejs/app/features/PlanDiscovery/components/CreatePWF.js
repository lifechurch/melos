import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

import Calendar from './Calendar'
import CalendarDay from './CalendarDay'
import LazyImage from '../../../components/LazyImage'
import { PLAN_DEFAULT } from '../../../lib/imageUtil'


class CreatePWF extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedDay: null
		}
	}

	handleDaySelect = (day) => {
		this.setState({
			selectedDay: day
		})
	}

	handleCreateSubscription = () => {
		const { onHandleSubscribe } = this.props
		const { selectedDay } = this.state
		if (selectedDay) {
			if (typeof onHandleSubscribe === 'function') {
				onHandleSubscribe(selectedDay)
			}
		}
		return false
	}

	renderDay = ({ day }) => {
		const { selectedDay } = this.state
		const isInPast = (day < new Date())

		return (
			<CalendarDay
				customClass={`${(selectedDay && (selectedDay.getDate() === day.getDate())) ? 'yv-active' : ''}`}
				date={day.getDate()}
				disabled={isInPast}
				handleClick={this.handleDaySelect.bind(this, day)}
			/>
		)
	}

	render() {
		const { planImgSrc, backPath } = this.props
		const { selectedDay } = this.state

		return (
			<div className='pwf-flow pwf-create row'>
				<div className='reading_plan_index_header columns medium-8 small-12 small-centered'>
					<div className='row'>
						<Link
							className='plans vertical-center columns medium-4'
							to={backPath}
						>
							&larr;
						</Link>
						<h4 className='text-center columns medium-4'>Select Start Date</h4>
						<div className='columns medium-4 text-right'>
							<a
								tabIndex={0}
								className={`solid-button ${selectedDay ? 'green' : 'disabled-link'}`}
								onClick={this.handleCreateSubscription}
							>Do stuff</a>
						</div>
					</div>
				</div>
				<div className='gray-background content text-center'>
					<div className='columns medium-8 small-12 small-centered'>
						<div className='horizontal-center' style={{ height: '250px', marginBottom: '30px' }}>
							<LazyImage
								alt='plan-image'
								src={planImgSrc}
								width={400}
								height={250}
								placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
							/>
						</div>
						<Calendar showFullWeeks={false}>
							{ this.renderDay }
						</Calendar>
					</div>
				</div>
			</div>
		)
	}
}

CreatePWF.propTypes = {
	planImgSrc: PropTypes.string,
	backPath: PropTypes.string,
	onHandleSubscribe: PropTypes.func.isRequired,
}

CreatePWF.defaultProps = {
	planImgSrc: null,
	backPath: null,
}

export default CreatePWF
