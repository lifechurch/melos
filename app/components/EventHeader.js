import React, { Component } from 'react'
import Row from './Row'
import Column from './Column'
import EventEditNav from '../features/EventEdit/components/EventEditNav'
import ActionCreators from '../features/EventEdit/features/details/actions/creators'
import AuthActionCreators from '../features/Auth/actions/creators'
import { routeActions } from 'react-router-redux'

class EventHeader extends Component {
	handleCancel() {
		const { dispatch } = this.props
		dispatch(ActionCreators.cancel())
	}

	handleSave() {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.saveDetails(event.item, false))
	}

	handleLogout() {
		const { dispatch } = this.props
		dispatch(AuthActionCreators.logout())
	}

	render() {
		const { event, auth } = this.props
		const { isSaving, errors } = event
		if (auth.isLoggedIn) {
			return (
				<div className='event-header'>
					<Row>
						<Column s='medium-4'>
							<a onClick={::this.handleCancel}>Cancel</a>
						</Column>

						<Column s='medium-4' a='center'>
							EVENT BUILDER
						</Column>

						<Column s='medium-4' a='right'>
							{auth.userData.first_name} {auth.userData.last_name} <a onClick={::this.handleLogout}>Sign Out</a>
						</Column>
					</Row>

					<Row>
						<Column s='medium-6'>
							<EventEditNav {...this.props} />
						</Column>

						<Column s='medium-6' a='right'>
							<a className='solid-button gray' onClick={::this.handleSave} disabled={errors.hasError || isSaving}>{ isSaving ? 'Saving...' : 'Save as Draft' }</a>&nbsp;
							<a className='solid-button green'>Publish</a>
						</Column>
					</Row>
				</div>
			)
		} else {
			return null
		}
	}
}

export default EventHeader