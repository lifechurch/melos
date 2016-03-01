import React, { Component, PropTypes } from 'react'
import { ActionCreators } from '../../../../../actions/modals'

class LocationAddButtons extends Component {

	handleAddPhysicalLocationClick(clickEvent) {
		const { event, dispatch, handleAddPhysicalLocationClick } = this.props
		if (typeof event.rules.locations.canAddPhysical === 'object') {
			const { modal } = event.rules.locations.canAddPhysical
			if (typeof modal === 'string') {
				dispatch(ActionCreators.openModal(modal))
			}
		} else {
			handleAddPhysicalLocationClick(clickEvent)
		}
	}

	handleAddVirtualLocationClick(clickEvent) {
		const { event, dispatch, handleAddVirtualLocationClick } = this.props

		if (typeof event.rules.locations.canAddVirtual === 'object') {
			const { modal } = event.rules.locations.canAddVirtual
			if (typeof modal === 'string') {
				dispatch(ActionCreators.openModal(modal))
			}
		} else {
			handleAddVirtualLocationClick(clickEvent)
		}
	}

	render() {
		const { event } = this.props
		return (
			<div className='location-add-buttons'>
				<a disabled={!event.rules.locations.canAddPhysical} className='hollow-button green' onClick={::this.handleAddPhysicalLocationClick}>Add a Physical Location</a>
				<p className='button-caption'>You can add multiple locations.</p>
				<a disabled={!event.rules.locations.canAddVirtual} className='hollow-button green' onClick={::this.handleAddVirtualLocationClick}>Add Virtual Location</a>
			</div>
		)
	}
}

LocationAddButtons.propTypes = {
	event: PropTypes.object.isRequired,
	handleAddPhysicalLocationClick: PropTypes.func.isRequired,
	handleAddVirtualLocationClick: PropTypes.func.isRequired
}

export default LocationAddButtons