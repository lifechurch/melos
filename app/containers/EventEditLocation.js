import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import { ActionCreators } from '../actions/loc'
import EditLocationForm from '../components/EditLocationForm'
import Location from '../components/Location'
import LocationAddButtons from '../components/LocationAddButtons'

class EventEditLocation extends Component {
	handleAddPhysicalLocationClick(clickEvent) {
		const { dispatch } = this.props
		dispatch(ActionCreators.addPhysical())
	}

	handleAddVirtualLocationClick(clickEvent) {
		const { dispatch } = this.props
		dispatch(ActionCreators.addVirtual())
	}	

	handleCancel() {
		const { dispatch } = this.props
		dispatch(ActionCreators.cancelEdit())
	}

	handleChange(event) {
		const { name, value } = event.target
		const { dispatch } = this.props
		dispatch(ActionCreators.setField(name, value))
	}

	handleChoosePlace(place) {
		const { dispatch } = this.props
		dispatch(ActionCreators.choosePlace(place))
	}

	handleSetTime(index, start_dt, end_dt) {
		const { dispatch } = this.props
		dispatch(ActionCreators.setTime(index, start_dt, end_dt))
	}

	handleAddTime() {
		const { dispatch } = this.props
		dispatch(ActionCreators.addTime())
	}

	handleCreate() {
		const { dispatch, event, loc } = this.props
		dispatch(ActionCreators.create(event.item.id, loc))
	}

	handleRemove(locationId) {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.remove(event.item.id, locationId))
	}

	handleEdit(loc) {
		const { dispatch } = this.props
		dispatch(ActionCreators.edit(loc))
	}

	render() {
		const { dispatch, event, loc } = this.props

		var locationEditor
		if (loc.hasOwnProperty("type")) {
			locationEditor = (<EditLocationForm  
				handleCancel={::this.handleCancel} 
				handleChange={::this.handleChange}
				handleChoosePlace={::this.handleChoosePlace}
				handleSetTime={::this.handleSetTime}
				handleAddTime={::this.handleAddTime}
				handleCreate={::this.handleCreate}
				dispatch={dispatch} 
				loc={loc} />
			)
		} 

		var locations = event.item.locations.map((l) => {
			return (<li><Location loc={l} handleRemove={::this.handleRemove} handleEdit={::this.handleEdit} /></li>)
		})

		var centerButtons
		if (!(event.item && event.item.locations && event.item.locations.length > 0)) {
			centerButtons = 'center-single-item'
		}


		return (			
			<div>
				<Helmet title="Event Location" />	
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">
						{locationEditor}
					</div>
				</Row>
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">
						<ul className="medium-block-grid-3">
							{locations}						
							<li className={centerButtons}>
								<LocationAddButtons 
									handleAddPhysicalLocationClick={::this.handleAddPhysicalLocationClick} 
									handleAddVirtualLocationClick={::this.handleAddVirtualLocationClick}>
								</LocationAddButtons>
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