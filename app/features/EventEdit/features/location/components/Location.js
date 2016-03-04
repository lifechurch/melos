import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import RevManifest from '../../../../../../app/lib/revManifest'

class Location extends Component {
	handleDeleteClick(clickEvent) {
		const { handleDelete, loc } = this.props
		handleDelete(loc)
	}

	handleEditClick(event) {
		const { handleEdit, loc } = this.props
		handleEdit(loc)
	}

	render() {
		const { loc, handleSelect, event } = this.props

		var times = loc.times.map((t,i) => {
			var start = moment(t.start_dt).format('ddd MMM D h:mm A')
			return (<p key={i}>{start}</p>)
		})

		let addTimeButton = null

		if (!Array.isArray(loc.times) || loc.times.length === 0) {
			addTimeButton = (
				<a className='addTimes' disabled={!event.rules.locations.canEdit} onClick={::this.handleEditClick} title='Add at least one time.'>
					Add at least one time.
				</a>
			)
		}

		const className = ['location-container', loc.isSelected ? 'selected' : 'not-selected'].join(' ')

		return (
			<div className={className}>
				<div className='header'>
					<div className='title'>
						<input disabled={!event.rules.locations.canRemove} type='checkbox' onChange={handleSelect} name={loc.id} checked={loc.isSelected} /> USE THIS LOCATION
					</div>
					<div className='header-actions'>
						<a disabled={!event.rules.locations.canEdit} onClick={::this.handleEditClick} title='Edit Location'>
							<img src={`/images/${RevManifest('edit.png')}`} />
						</a>
						<a disabled={!event.rules.locations.canDelete} onClick={::this.handleDeleteClick} title='Delete Location'>
							<img src={`/images/${RevManifest('thin-x.png')}`} />
						</a>
					</div>
				</div>
				<div className='body'>
					<p>{loc.name}</p>
					<p>{loc.formatted_address}</p>
					{addTimeButton}
					<div className='times'>
						{times}
					</div>
				</div>
			</div>
		)
	}
}

Location.propTypes = {
	loc: PropTypes.object.isRequired,
	handleDelete: PropTypes.func.isRequired,
	handleEdit: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired
}

export default Location
