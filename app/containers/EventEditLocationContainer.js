import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import ActionCreators from '../features/EventEdit/features/location/actions/creators'
import LocationEdit from '../features/EventEdit/features/location/components/LocationEdit'
import Location from '../features/EventEdit/features/location/components/Location'
import LocationAddButtons from '../features/EventEdit/features/location/components/LocationAddButtons'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class EventEditLocationContainer extends Component {
	handleAddPhysicalLocationClick(clickEvent) {
		const { dispatch } = this.props
		dispatch(ActionCreators.add('physical'))
	}

	handleAddVirtualLocationClick(clickEvent) {
		const { dispatch } = this.props
		dispatch(ActionCreators.add('virtual'))
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

	handleSave() {
		const { dispatch, event, loc } = this.props
		const { id } = loc
		if (typeof id === 'number' && id > 0) {
			dispatch(ActionCreators.update(event.item.id, loc)).then((result) => {
				console.log("RES", result)
				if (typeof result === 'object') {
					dispatch(ActionCreators.cancelEdit())
				}
			})
		} else {
			dispatch(ActionCreators.create(event.item.id, loc)).then((result) => {
				console.log("RES", result)				
				if (typeof result === 'object') {
					dispatch(ActionCreators.cancelEdit())
				}
			})
		}
	}

	handleRemove(locationId, index) {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.remove(event.item.id, locationId, index))
	}

	handleEdit(loc) {
		const { dispatch } = this.props
		dispatch(ActionCreators.edit(loc))
	}

	render() {
		const { dispatch, event, loc } = this.props

		var locations = event.item.locations.map((l, i) => {
			return (<li key={i}><Location index={i} loc={l} handleRemove={::this.handleRemove} handleEdit={::this.handleEdit} /></li>)
		})

		var centerButtons
		if (!(event.item && event.item.locations && event.item.locations.length > 0)) {
			centerButtons = 'center-single-item'
		}

		var locationEditor
		var locationList = null		
		if (loc && typeof loc.type === 'string') {
			locationEditor = (<LocationEdit key='locationeditor'  
				handleCancel={::this.handleCancel} 
				handleChange={::this.handleChange}
				handleChoosePlace={::this.handleChoosePlace}
				handleSetTime={::this.handleSetTime}
				handleAddTime={::this.handleAddTime}
				handleSave={::this.handleSave}
				dispatch={dispatch} 
				loc={loc} />
			)
		} else {
			locationList = (
				<ul className="medium-block-grid-3" key='locationlist'>
					<ReactCSSTransitionGroup className='medium-block-grid-3' transitionName="locationlist" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
						{locations}						
						<li className={centerButtons} key={-1}>
							<LocationAddButtons 
								handleAddPhysicalLocationClick={::this.handleAddPhysicalLocationClick} 
								handleAddVirtualLocationClick={::this.handleAddVirtualLocationClick}>
							</LocationAddButtons>
						</li>
					</ReactCSSTransitionGroup>
				</ul>				
			)			
		}

		return (			
			<div>
				<Helmet title="Event Location" />
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">
						<ReactCSSTransitionGroup transitionName="locationeditor" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
							{locationEditor}
							{locationList}							
						</ReactCSSTransitionGroup>
					</div>
				</Row>
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">

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

export default EventEditLocationContainer