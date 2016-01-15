import React, { Component, PropTypes } from 'react'
import DatePicker from 'react-datepicker'
import Row from './Row'
import Column from './Column'
import moment from 'moment'

function getDisplay(hour, minute) {
	return [
		(hour > 12 ? hour - 12 : (hour == 0 ? '12' : hour)),
		':',
		(minute < 10 ? '0' + minute.toString() : minute),
		(hour > 11 ? ' PM' : ' AM')
	].join('');
}

function getTimeObject(hour, minute) {
	return {
		hour,
		display: getDisplay(hour, minute),
		minute,
		value: [hour,minute].join(':')
	}
}

function changeTime(dt, t) {
	var t = t.split(':')
	var new_dt = moment(dt.toISOString())
	new_dt.hour(t[0])
	new_dt.minute(t[1])
	return new_dt
}

function getEndDate(start_dt, start_time, duration) {
	var end_dt = changeTime(start_dt, start_time)
	end_dt.add(duration, 'h')
	return end_dt
}

function timeValues() {
	var values = [];
	for (var hour = 0; hour < 24; hour++) {
		values.push(getTimeObject(hour, 0))
		values.push(getTimeObject(hour, 30))
	}
	return values
}

function getState(start_dt, start_time, duration) {
	console.log(start_dt.toISOString(), start_time, duration)
	var new_start_dt = changeTime(start_dt, start_time)
	console.log(new_start_dt.toISOString())
	return {
		start_dt: new_start_dt,
		start_time: start_time,
		duration: duration,
		end_dt: getEndDate(new_start_dt, start_time, duration)
	}
}

class EventAddTimeForm extends Component {

	constructor(props) {
		super(props)
		this.state = {
			start_dt: props.time.start_dt,
			start_time: null,
			duration: null,
			end_dt: props.time.end_dt
		}
	}

	handleStartDateChange(date) {
		this.setState(getState(date, this.state.start_time, this.state.duration))
	}

	handleStartTimeChange(event) {
		this.setState(getState(this.state.start_dt, event.target.value, this.state.duration))
	}

	handleDurationChange(event) {
		this.setState(getState(this.state.start_dt, this.state.start_time, event.target.value))
	}

	render() {
		const { time } = this.props
		const { start_dt, duration, start_time } = this.state

		const values = timeValues().map((v) => {
			return <option key={v.display} value={v.value}>{v.display}</option>
		})

		return (
			<form className="event-edit-location-form">
				<Row>
					<Column s='small-4'>
						<DatePicker placeholderText='Start Date' onChange={::this.handleStartDateChange} selected={start_dt} popoverTargetAttachment='top center' popoverAttachment='bottom center' popoverTargetOffset='0px 0px' />
					</Column>

					<Column s='small-4'>
						<select className='small' placeholder='Start Time' name='start_time' onChange={::this.handleStartTimeChange} value={start_time}>
							{values}
						</select>
					</Column>

					<Column s='small-4'>
						<input type="text" className='small' placeholder='Duration' name='duration' onChange={::this.handleDurationChange} value={duration} />
					</Column>
				</Row>
				{}
			</form>
		)
	}
}

EventAddTimeForm.defaultProps = {
	time: {
		id: null,
		start_dt: null,
		end_dt: null
	}
}

EventAddTimeForm.propTypes = {
	handleChange: PropTypes.func.isRequired,
	time: PropTypes.object.isRequired,
	timeIndex: PropTypes.number.isRequired
}

export default EventAddTimeForm