import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import { ActionCreators as ModalActionCreators } from '../actions/modals'
import { ActionCreators as LocationActionCreators } from '../actions/loc'
import AddLocationModal from '../components/AddLocationModal'

class EventEditLocation extends Component {
	handleAddPhysicalLocationClick(clickEvent) {
		const { dispatch } = this.props
		dispatch(LocationActionCreators.addPhysical())
		dispatch(ModalActionCreators.openModal('addLocation'))
	}

	handleAddVirtualLocationClick(clickEvent) {
		const { dispatch } = this.props
		dispatch(LocationActionCreators.addVirtual())
		dispatch(ModalActionCreators.openModal('addLocation'))
	}	

	handleModalClose() {
		const { dispatch } = this.props
		dispatch(ModalActionCreators.closeModal('addLocation'))
	}

	handleChange(event) {
		const { name, value } = event.target
		const { dispatch } = this.props
		dispatch(LocationActionCreators.setField(name, value))
	}

	render() {
		const { dispatch, event, loc, modals } = this.props
		return (			
			<div>
				<Helmet title="Event Location" />	
				<AddLocationModal 
					isOpen={modals.addLocation} 
					handleClose={::this.handleModalClose} 
					handleChange={::this.handleChange}
					dispatch={dispatch} 
					loc={loc} />
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">
						<a className="hollow-button green" onClick={::this.handleAddPhysicalLocationClick}>Add a Physical Location</a>
						<p>Does your event meet online? <a>Add times for virtual location</a></p>
						<br /><br />
						<a className="hollow-button green" onClick={::this.handleAddVirtualLocationClick}>Add Your Virtual Location</a>
						<p>Does your event meet online? <a>Add times for virtual location</a></p>						
					</div>
				</Row>
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">
						<ul className="medium-block-grid-3">
							<li>
								<div className='location-container'></div>
							</li>
							<li>
								<div className='location-container'></div>
							</li>
							<li>
								<div className='location-container'></div>
							</li>
							<li>
								<div className='location-container'></div>
							</li>
							<li>
								<div className='location-container'></div>
							</li>																												
						</ul>
					</div>
				</Row>
				<Row>
					<Column s='medium-12' a='right'>
						<a disabled={!event.locationsValid}>Next: Add Content</a>
					</Column>
				</Row>				
			</div>
		)
	}
}

export default EventEditLocation