import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import { Link } from 'react-router'
import ActionCreators from '../features/EventEdit/features/location/actions/creators'
import EventActionCreators from '../features/EventEdit/features/details/actions/creators'
import { ActionCreators as ModalActionCreators } from '../actions/modals'
import LocationEdit from '../features/EventEdit/features/location/components/LocationEdit'
import LocationDeleteModal from '../features/EventEdit/features/location/components/LocationDeleteModal'
import UnpublishModal from '../features/EventEdit/features/location/components/UnpublishModal'
import Location from '../features/EventEdit/features/location/components/Location'
import LocationAddButtons from '../features/EventEdit/features/location/components/LocationAddButtons'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import LocationTimeShifter from '../features/EventEdit/features/location/components/LocationTimeShifter'
import { injectIntl, FormattedHTMLMessage } from 'react-intl'

class EventEditLocationContainer extends Component {
	componentWillMount() {
		const { dispatch } = this.props
		dispatch(ActionCreators.items())
	}

	handleCloseUnpublishModal() {
		const { dispatch } = this.props
		dispatch(ModalActionCreators.closeModal('Unpublish'))
	}

	handleCloseModal() {
		const { dispatch } = this.props
		dispatch(ModalActionCreators.closeModal('LocationDelete'))
	}

	handleOpenModal(loc) {
		const { event, dispatch } = this.props
		if (typeof event.rules.locations.canDelete === 'object') {
			const { modal } = event.rules.locations.canDelete
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			const { dispatch } = this.props
			dispatch(ModalActionCreators.openModal('LocationDelete', loc))
		}
	}

	handleDelete(loc) {
		const { event, dispatch } = this.props
		if (typeof event.rules.locations.canDelete === 'object') {
			const { modal } = event.rules.locations.canDelete
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			dispatch(ActionCreators.delete(loc.id))
			dispatch(ModalActionCreators.closeModal('LocationDelete'))
		}
	}

	handleAddPhysicalLocationClick(clickEvent) {
		const { auth, event, dispatch } = this.props
		if (typeof event.rules.locations.canAddPhysical === 'object') {
			const { modal } = event.rules.locations.canAddPhysical
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			dispatch(ActionCreators.add({locationType: 'physical', auth}))
		}
	}

	handleAddVirtualLocationClick(clickEvent) {
		const { auth, event, dispatch } = this.props
		if (typeof event.rules.locations.canAddVirtual === 'object') {
			const { modal } = event.rules.locations.canAddVirtual
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			dispatch(ActionCreators.add({locationType: 'virtual', auth}))
		}
	}

	handleCancel() {
		const { dispatch } = this.props
		dispatch(ActionCreators.cancelEdit())
	}

	handleSelect(selectEvent) {
		const { event, dispatch } = this.props
		const { name, checked } = selectEvent.target
		if (typeof event.rules.locations.canRemove === 'object') {
			const { modal } = event.rules.locations.canRemove
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			if (checked === true) {
				dispatch(ActionCreators.addLocation(event.item.id, name))
			} else {
				dispatch(ActionCreators.removeLocation(event.item.id, name))
			}
		}
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
		const { event, dispatch } = this.props
		if (typeof event.rules.locations.canEdit === 'object') {
			const { modal } = event.rules.locations.canEdit
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			dispatch(ActionCreators.addTime())
		}
	}

	handleRemoveTime(index) {
		const { event, dispatch } = this.props
		if (typeof event.rules.locations.canEdit === 'object') {
			const { modal } = event.rules.locations.canEdit
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			dispatch(ActionCreators.removeTime(index))
		}
	}

	handleSave() {
		const { dispatch, event, loc } = this.props
		const { id } = loc
		if (typeof id === 'number' && id > 0) {
			dispatch(ActionCreators.update(event.item.id, loc)).then((result) => {
				if (typeof result === 'object' && !result.errors) {
					dispatch(ActionCreators.cancelEdit())
				}
			})
		} else {
			dispatch(ActionCreators.create(event.item.id, loc)).then((result) => {
				if (typeof result === 'object' && !result.errors) {
					dispatch(ActionCreators.cancelEdit())
				}
			})
		}
	}

	handleRemove(locationId, index) {
		const { dispatch, event } = this.props
		if (typeof event.rules.locations.canRemove === 'object') {
			const { modal } = event.rules.locations.canRemove
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			dispatch(ActionCreators.remove(event.item.id, locationId, index))
		}
	}

	handleEdit(loc) {
		const { event, dispatch } = this.props
		if (typeof event.rules.locations.canEdit === 'object') {
			const { modal } = event.rules.locations.canEdit
			dispatch(ModalActionCreators.openModal(modal))
		} else {
			dispatch(ActionCreators.edit(loc))
		}
	}

	render() {
		const { dispatch, event, loc, modals, intl, params } = this.props

		var locations = []
		var index = 0
		for (var key in event.item.locations) {
			const loc = event.item.locations[key]
			locations.push(<li key={index}><Location intl={intl} dispatch={dispatch} event={event} index={index} loc={loc} handleSelect={::this.handleSelect} handleDelete={::this.handleOpenModal} handleEdit={::this.handleEdit} /></li>)
			index++
		}

		var centerButtons
		if (!(event.item && event.item.locations && Object.keys(event.item.locations).length > 0)) {
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
				handleRemoveTime={::this.handleRemoveTime}
				handleSave={::this.handleSave}
				dispatch={dispatch}
				loc={loc}
				intl={intl} />
			)
		} else {
			locationList = (
				<ul className="medium-block-grid-3" key='locationlist'>
					<ReactCSSTransitionGroup className='medium-block-grid-3' transitionName="locationlist" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
						{locations}
						<li className={centerButtons} key={-1}>
							<LocationAddButtons
								dispatch={dispatch}
								event={event}
								handleAddPhysicalLocationClick={::this.handleAddPhysicalLocationClick}
								handleAddVirtualLocationClick={::this.handleAddVirtualLocationClick}
								intl={intl}>
							</LocationAddButtons>
						</li>
					</ReactCSSTransitionGroup>
				</ul>
			)
		}

		return (
			<div>
				<Helmet title={intl.formatMessage({ id: "containers.EventEditLocationContainer.title" })} />
				<Row>
					<Column s='medium-12'>
						<LocationTimeShifter intl={intl} dispatch={dispatch} event={event} />
					</Column>
				</Row>
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">

						<ReactCSSTransitionGroup transitionName="locationeditor" transitionEnterTimeout={250} transitionLeaveTimeout={250}>
							{locationEditor}
							{locationList}
						</ReactCSSTransitionGroup>
						<LocationDeleteModal intl={intl} modalState={modals.LocationDelete} handleDelete={::this.handleDelete} handleClose={::this.handleCloseModal} />
						<UnpublishModal intl={intl} event={event} dispatch={dispatch} modalState={modals.Unpublish} handleClose={::this.handleCloseUnpublishModal} />
					</div>
				</Row>
				<Row>
					<div className="medium-10 large-8 columns small-centered text-center">

					</div>
				</Row>
				<Row>
					<Column s='medium-6'>
						<Link disabled={!event.rules.details.canView || event.isReordering} to={`/${params.locale}/event/edit/${event.item.id}`}><FormattedHTMLMessage id="containers.EventEditLocationContainer.previous" /></Link>
					</Column>
					<Column s='medium-6' a='right'>
						<Link disabled={!event.rules.content.canView || event.isReordering} to={`/${params.locale}/event/edit/${event.item.id}/content`}><FormattedHTMLMessage id="containers.EventEditLocationContainer.next" /></Link>
					</Column>
				</Row>
			</div>
		)
	}
}

export default injectIntl(EventEditLocationContainer)
