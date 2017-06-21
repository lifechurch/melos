import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { FormattedMessage } from 'react-intl'
import EditImage from '../../../../../../images/edit.png'
import ThinXImage from '../../../../../../images/thin-x.png'

class Location extends Component {
	constructor(props) {
		super(props)

	}

	handleDeleteClick(clickEvent) {
		const { handleDelete, loc } = this.props
		handleDelete(loc)
	}

	handleEditClick(event) {
		const { handleEdit, loc } = this.props
		handleEdit(loc)
	}

	render() {
		const { loc, handleSelect, event, intl } = this.props

		const times = loc.times.map((t, i) => {
			const start = moment.tz(t.start_dt, loc.timezone).format('llll')
			return (<p key={i}>{start}</p>)
		})

		let addTimeButton = null

		if (!Array.isArray(loc.times) || loc.times.length === 0) {
			addTimeButton = (
				<a className='addTimes' disabled={!event.rules.locations.canEdit} onClick={::this.handleEditClick} title={intl.formatMessage({ id: 'features.EventEdit.features.location.components.Location.oneRequired' })}>
					<FormattedMessage id="features.EventEdit.features.location.components.Location.oneRequired" />
				</a>
			)
		}

		const className = ['location-container', loc.isSelected ? 'selected' : 'not-selected'].join(' ')

		return (
			<div className={className}>
				<div className='header'>
					<div className='title'>
						<input disabled={!event.rules.locations.canRemove} type='checkbox' onChange={handleSelect} name={loc.id} checked={loc.isSelected} /> <FormattedMessage id="features.EventEdit.features.location.components.Location.use" />
					</div>
					<div className='header-actions'>
						<a disabled={!event.rules.locations.canEdit} onClick={::this.handleEditClick} title={intl.formatMessage({ id: 'features.EventEdit.features.location.components.Location.edit' })}>
							<img src={EditImage} />
						</a>
						<a disabled={!event.rules.locations.canDelete} onClick={::this.handleDeleteClick} title={intl.formatMessage({ id: 'features.EventEdit.features.location.components.Location.delete' })}>
							<img src={ThinXImage} />
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
