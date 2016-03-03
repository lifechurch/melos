import React, { Component, PropTypes } from 'react'
import RevManifest from '../../../../../../app/lib/revManifest'

class LocationTimeShifter extends Component {
	constructor(props) {
		super(props)
		this.state = { isOpen: false, direction: 1, count: 1, interval: 'week' }
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
		console.log(this.state)
	}

	render() {
		if (this.state.isOpen) {
			return (
				<div className='text-left'>
					<a onClick={::this.close}><img src={`/images/${RevManifest('thin-x.png')}`} /></a>
					Shift start dates
					<select name='direction' onChange={::this.handleChange} value={this.state.direction}>
						<option value={1}>forward</option>
						<option value={-1}>backward</option>
					</select>
					by
					<input type='number' name='count' onChange={::this.handleChange} value={this.state.count} />
					<select name='interval' onChange={::this.handleChange} value={this.state.interval}>
						<option value='week'>{this.state.count > 1 ? 'weeks' : 'week'}</option>
						<option value='month'>{this.state.count > 1 ? 'months' : 'month'}</option>
						<option value='day'>{this.state.count > 1 ? 'days' : 'day'}</option>
						<option value='hour'>{this.state.count > 1 ? 'hours' : 'hour'}</option>
					</select>
					<a className='solid-button gray' onClick={::this.shift}>Update</a>
				</div>
			)
		} else {
			return (
				<div className='text-left'>
					<a onClick={::this.open}>Shift all dates and times at once</a>
				</div>
			)
		}
	}
}

export default LocationTimeShifter