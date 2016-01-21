import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class Location extends Component {
	handleRemoveClick(event) {
		const { handleRemove, loc } = this.props
		handleRemove(loc.id)
	}

	handleEditClick(event) {
		const { handleEdit, loc } = this.props
		handleEdit(loc)
	}

	render() {
		const { loc } = this.props

		var times = loc.times.map((t) => {
			var start = moment(t.start_dt).format('ddd MMM D h:mm A')
			return (<p>{start}</p>)
		})

		return (
			<div className='location-container'>
				<div className='header'>
					<div className='title'>
						<input type='checkbox' /> USE THIS LOCATION
					</div>
					<div className='header-actions'>
						<a onClick={::this.handleEditClick} title='Edit Location'>
							<img src="/images/edit.png" />
						</a>						
						<a onClick={::this.handleRemoveClick} title='Remove Location'>
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
	handleRemove: PropTypes.func.isRequired,
	handleEdit: PropTypes.func.isRequired
}

export default Location