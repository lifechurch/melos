import React, { Component, PropTypes } from 'react'

class LocationAddButtons extends Component {
	render() {
		const { handleAddPhysicalLocationClick, handleAddVirtualLocationClick } = this.props
		return (
			<div className='location-add-buttons'>
				<a className='hollow-button green' onClick={handleAddPhysicalLocationClick}>Add a Physical Location</a>
				<p className='button-caption'>You can add multiple locations.</p>
				<a className='hollow-button green' onClick={handleAddVirtualLocationClick}>Add Virtual Location</a>
			</div>
		)
	}
}

LocationAddButtons.propTypes = {
	handleAddPhysicalLocationClick: PropTypes.func.isRequired,
	handleAddVirtualLocationClick: PropTypes.func.isRequired
}

export default LocationAddButtons