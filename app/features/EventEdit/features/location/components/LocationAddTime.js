import React, { Component, PropTypes } from 'react'
import DatePicker from 'react-datepicker'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
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

function getTime(dt) {
	return [dt.hour(), dt.minute()].join(':')
}

function getDurationAndInterval(start_dt, end_dt) {
	const s = start_dt.toDate().getTime()
	const e = end_dt.toDate().getTime()
	const d = e - s

	const oneMinute = 1000 * 60;
	const oneHour = oneMinute * 60;
	const oneDay = oneHour * 24;

	if (d % oneDay === 0) {
		return {
			duration: d / oneDay,
			interval: 'd'
		}
	} else if (d % oneHour === 0) {
		return {
			duration: d / oneHour,
			interval: 'h'
		}
	} else if (d % oneMinute) {
		return {
			duation: d / oneMinute,
			interval: 'm'
		}
	} else {
		return null;
	}
}

function getEndDate(start_dt, start_time, duration, interval) {
	var end_dt = changeTime(start_dt, start_time)
	end_dt.add(duration, interval)
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

function getState(start_dt, start_time, duration, interval, props) {
	const { handleTimeChange, timeIndex } = props
	var new_start_dt = changeTime(start_dt, start_time)
	var new_end_dt = getEndDate(new_start_dt, start_time, duration, interval)
	handleTimeChange(timeIndex, new_start_dt, new_end_dt)
	return {
		start_dt: new_start_dt,
		start_time: start_time,
		duration: duration,
		end_dt: new_end_dt,
		interval: interval
	}

}

class LocationAddTime extends Component {

	constructor(props) {
		super(props)
		const durationObj = getDurationAndInterval(props.time.start_dt, props.time.end_dt)
		this.state = {
			start_dt: props.time.start_dt,
			start_time: getTime(props.time.start_dt),
			duration: durationObj.duration,
			interval: durationObj.interval,
			end_dt: props.time.end_dt
		}
	}

	handleStartDateChange(date) {
		this.setState(getState(date, this.state.start_time, this.state.duration, this.state.interval, this.props))
	}

	handleStartTimeChange(event) {
		this.setState(getState(this.state.start_dt, event.target.value, this.state.duration, this.state.interval, this.props))
	}

	handleDurationChange(event) {
		this.setState(getState(this.state.start_dt, this.state.start_time, event.target.value, this.state.interval, this.props))
	}

	handleIntervalChange(event) {
		this.setState(getState(this.state.start_dt, this.state.start_time, this.state.duration, event.target.value, this.props))
	}

	render() {
		const { time } = this.props
		const { start_dt, duration, start_time, interval } = this.state

		const values = timeValues().map((v) => {
			return <option key={v.display} value={v.value}>{v.display}</option>
		})

		return (
			<form className="event-edit-location-form event-edit-time-form">
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
						<Row className="collapse">
							<Column s='small-6'>
								<input type="text" className='small' placeholder='1' name='duration' onChange={::this.handleDurationChange} value={duration} />							
							</Column>
							<Column s='small-6'>
								<select className='small' name='interval' onChange={::this.handleIntervalChange} value={interval}>
									<option value='m'>minutes</option>
									<option value='h'>hours</option>
									<option value='d'>days</option>
								</select>
							</Column>
						</Row>

					</Column>
				</Row>
				{}
			</form>
		)
	}
}

// LocationAddTime.defaultProps = {
// 	time: {
// 		id: null,
// 		start_dt: null,
// 		end_dt: null,
// 		interval: null
// 	}
// }

LocationAddTime.propTypes = {
	time: PropTypes.object.isRequired,
	timeIndex: PropTypes.number.isRequired,
	handleTimeChange: PropTypes.func.isRequired
}

export default LocationAddTime