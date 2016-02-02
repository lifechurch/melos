import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class Location extends Component {
	handleDeleteClick(event) {
		const { handleDelete, loc, index } = this.props
		handleDelete(loc)
	}

	handleEditClick(event) {
		const { handleEdit, loc } = this.props
		handleEdit(loc)
	}

	render() {
		const { loc, handleSelect } = this.props

		var times = loc.times.map((t,i) => {
			var start = moment(t.start_dt).format('ddd MMM D h:mm A')
			return (<p key={i}>{start}</p>)
		})

		const className = ['location-container', loc.isSelected ? 'selected' : 'not-selected'].join(' ')

		return (
			<div className={className}>
				<div className='header'>
					<div className='title'>
						<input type='checkbox' onClick={handleSelect} name={loc.id} checked={loc.isSelected} /> USE THIS LOCATION
					</div>
					<div className='header-actions'>
						<a onClick={::this.handleEditClick} title='Edit Location'>
							<img src="/images/edit.png" />
						</a>						
						<a onClick={::this.handleDeleteClick} title='Delete Location'>
							<img src="/images/thin-x.png" />
						</a>
					</div>
				</div>
				<div className='body'>
					<p>{loc.name}</p>
					<p>{loc.formatted_address}</p>
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