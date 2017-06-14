import React, { Component, PropTypes } from 'react'
import ThinXImage from '../../../../../../images/thin-x.png'
import ActionCreators from '../actions/creators'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'

class LocationTimeShifter extends Component {
	constructor(props) {
		super(props)

		this.state = { isOpen: false, direction: 1, duration: 1, interval: 'weeks' }
	}

	open() {
		this.setState({ isOpen: true })
	}

	close() {
		this.setState({ isOpen: false })
	}

	handleChange(changeEvent) {
		const { name, value } = changeEvent.target
		this.setState({ [name]: value })
	}

	shift() {
		const { dispatch, event } = this.props
		const { duration, interval, direction } = this.state
		for (const id in event.item.locations) {
			const l = event.item.locations[id]
			const newLoc = Object.assign({}, l, {
				times: l.times.map((o) => {
					const start_dt = moment(o.start_dt)
					start_dt.add(duration * direction, interval)

					const end_dt = moment(o.end_dt)
					end_dt.add(duration * direction, interval)

					return {
						start_dt,
						end_dt,
						id: o.id
					}
				})
			})
			dispatch(ActionCreators.update(event.item.id, newLoc))
		}
	}

	render() {
		const { intl } = this.props

		if (this.state.isOpen) {
			return (
				<div className='text-left shift-bar open'>
					<a onClick={::this.close}><img src={ThinXImage} /></a>
					<FormattedMessage id="features.EventEdit.features.location.components.LocationTimeShifter.shift" />
					<select name='direction' onChange={::this.handleChange} value={this.state.direction}>
						<option value={1}>{intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.forward' })}</option>
						<option value={-1}>{intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.backward' })}</option>
					</select>
					<FormattedMessage id="features.EventEdit.features.location.components.LocationTimeShifter.by" />
					<input type='number' name='duration' onChange={::this.handleChange} value={this.state.duration} />
					<select name='interval' onChange={::this.handleChange} value={this.state.interval}>
						<option value='weeks'>{this.state.duration > 1 ? intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.weeks' }) : intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.week' })}</option>
						<option value='months'>{this.state.duration > 1 ? intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.months' }) : intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.month' })}</option>
						<option value='days'>{this.state.duration > 1 ? intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.days' }) : intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.day' })}</option>
						<option value='hours'>{this.state.duration > 1 ? intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.hours' }) : intl.formatMessage({ id: 'features.EventEdit.features.location.components.LocationTimeShifter.hours' })}</option>
					</select>
					<a className='solid-button gray' onClick={::this.shift}><FormattedMessage id="features.EventEdit.features.location.components.LocationTimeShifter.update" /></a>
				</div>
			)
		} else {
			return (
				<div className='text-left shift-bar'>
					<a onClick={::this.open}><FormattedMessage id="features.EventEdit.features.location.components.LocationTimeShifter.shiftButton" /></a>
				</div>
			)
		}
	}
}

export default LocationTimeShifter
