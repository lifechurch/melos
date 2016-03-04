import React, { Component, PropTypes } from 'react'
import RevManifest from '../../../../../../app/lib/revManifest'
import ActionCreators from '../actions/creators'
import moment from 'moment'

class LocationTimeShifter extends Component {
	constructor(props) {
		super(props)
		this.state = { isOpen: false, direction: 1, duration: 1, interval: 'week' }
	}

	open() {
		this.setState({isOpen:true})
	}

	close() {
		this.setState({isOpen:false})
	}

	handleChange(changeEvent) {
		const { name, value } = changeEvent.target
		this.setState({[name]: value})
	}

	shift() {
		const { dispatch, event } = this.props
		const { duration, interval, direction } = this.state
		for(const id in event.item.locations) {
			const l = event.item.locations[id]
			const newLoc = Object.assign({}, l, {
				times: l.times.map((o) => {
					let start_dt = moment(o.start_dt)
					start_dt.add(duration  * direction, interval)

					let end_dt = moment(o.end_dt)
					end_dt.add(duration  * direction, interval)

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
		if (this.state.isOpen) {
			return (
				<div className='text-left shift-bar open'>
					<a onClick={::this.close}><img src={`/images/${RevManifest('thin-x.png')}`} /></a>
					Shift start dates
					<select name='direction' onChange={::this.handleChange} value={this.state.direction}>
						<option value={1}>forward</option>
						<option value={-1}>backward</option>
					</select>
					by
					<input type='number' name='duration' onChange={::this.handleChange} value={this.state.duration} />
					<select name='interval' onChange={::this.handleChange} value={this.state.interval}>
						<option value='weeks'>{this.state.duration > 1 ? 'weeks' : 'week'}</option>
						<option value='months'>{this.state.duration > 1 ? 'months' : 'month'}</option>
						<option value='days'>{this.state.duration > 1 ? 'days' : 'day'}</option>
						<option value='hours'>{this.state.duration > 1 ? 'hours' : 'hour'}</option>
					</select>
					<a className='solid-button gray' onClick={::this.shift}>Update</a>
				</div>
			)
		} else {
			return (
				<div className='text-left shift-bar'>
					<a onClick={::this.open}>Shift all dates and times at once</a>
				</div>
			)
		}
	}
}

export default LocationTimeShifter