import React, { Component, PropTypes } from 'react'

class LocationAddButtons extends Component {
	render() {
		const { event, handleAddPhysicalLocationClick, handleAddVirtualLocationClick } = this.props
		return (
			<div className='location-add-buttons'>
				<a disabled={!event.rules.locations.canAddPhysical} className='hollow-button green' onClick={handleAddPhysicalLocationClick}>Add a Physical Location</a>
				<p className='button-caption'>You can add multiple locations.</p>
				<a disabled={!event.rules.locations.canAddVirtual} className='hollow-button green' onClick={handleAddVirtualLocationClick}>Add Virtual Location</a>
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