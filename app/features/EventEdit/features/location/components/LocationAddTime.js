import React, { Component, PropTypes } from 'react'
import DatePicker from 'react-datepicker'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
//import moment from 'moment'
import TimePicker from 'react-time-picker'
import RevManifest from '../../../../../../app/lib/revManifest'
import moment from 'moment-timezone'

//Polyfill for isInteger
Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" &&
    isFinite(value) &&
    Math.floor(value) === value;
};

function changeTime(dt, t) {
	var t = t.replace(/ /, ':').split(':')
	let new_dt = moment(dt)

	if (t.length > 2 && t[0] != 12 && t[2] == 'pm') {
		t[0] = parseInt(t[0]) + 12
	} else if (t.length > 2 && t[0] == 12 && t[2] == 'am') {
		t[0] = 0
	}

	new_dt.hour(t[0])
	new_dt.minute(t[1])
	return new_dt
}

function getTime(dt) {
	return [dt.hour(), dt.minute()].join(':')
}

function getDurationAndInterval(start_dt, end_dt) {
	if (Number.isInteger(end_dt.diff(start_dt, 'days', true))) {
		return {
			duration: end_dt.diff(start_dt, 'days'),
			interval: 'd'
		}
	} else if (Number.isInteger(end_dt.diff(start_dt, 'hours', true))) {
		return {
			duration: end_dt.diff(start_dt, 'hours'),
			interval: 'h'
		}
	} else if (Number.isInteger(end_dt.diff(start_dt, 'minutes', true))) {
		return {
			duration: end_dt.diff(start_dt, 'minutes'),
			interval: 'm'
		}
	} else {
		return null
	}
}

function getEndDate(start_dt, start_time, duration, interval) {
	var end_dt = changeTime(start_dt, start_time)
	end_dt.add(duration, interval)
	return end_dt
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

	handleStartTimeChange(time) {
		this.setState(getState(this.state.start_dt, time, this.state.duration, this.state.interval, this.props))
	}

	handleDurationChange(event) {
		this.setState(getState(this.state.start_dt, this.state.start_time, event.target.value, this.state.interval, this.props))
	}

	handleIntervalChange(event) {
		this.setState(getState(this.state.start_dt, this.state.start_time, this.state.duration, event.target.value, this.props))
	}

	render() {
		const { time, timeIndex, handleRemoveTime, intl } = this.props
		const { start_dt, duration, start_time, interval } = this.state

		return (
			<form className="event-edit-location-form event-edit-time-form">
				<Row>
					<div className='small-1 columns'>
						<a className='removeTime' onClick={handleRemoveTime.bind(this, timeIndex)}><img src={`/images/${RevManifest('thin-x.png')}`} /></a>
					</div>

					<div className='small-3 columns textField'>
						<DatePicker placeholderText='Start Date' weekStart='0' onChange={::this.handleStartDateChange} selected={start_dt} popoverTargetAttachment='top center' popoverAttachment='bottom center' popoverTargetOffset='0px 0px' />
					</div>

					<Column s='small-4'>
						<TimePicker className='timePicker' onChange={::this.handleStartTimeChange} value={start_time} format={window.__LOCALE__.momentLocaleData.longDateFormat('LT')} />
					</Column>

					<div className='small-4 columns textField'>
						<Row className="collapse">
							<Column s='small-6'>
								<input type="text" className='small' placeholder='1' name='duration' onChange={::this.handleDurationChange} value={duration} />
							</Column>
							<Column s='small-6'>
								<select className='small' name='interval' onChange={::this.handleIntervalChange} value={interval}>
									<option value='m'>{intl.formatMessage({id:"features.EventEdit.features.location.components.LocationAddTime.minutes"})}</option>
									<option value='h'>{intl.formatMessage({id:"features.EventEdit.features.location.components.LocationAddTime.hours"})}</option>
									<option value='d'>{intl.formatMessage({id:"features.EventEdit.features.location.components.LocationAddTime.days"})}</option>
								</select>
							</Column>
						</Row>

					</div>
				</Row>
				{}
			</form>
		)
	}
}

LocationAddTime.propTypes = {
	time: PropTypes.object.isRequired,
	timeIndex: PropTypes.number.isRequired,
	handleTimeChange: PropTypes.func.isRequired
}

export default LocationAddTime
