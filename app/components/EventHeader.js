import React, { Component } from 'react'
import Row from './Row'
import Column from './Column'
import EventEditNav from '../features/EventEdit/components/EventEditNav'
import ActionCreators from '../features/EventEdit/features/details/actions/creators'
import PreviewActionCreators from '../features/EventEdit/features/preview/actions/creators'
import AuthActionCreators from '../features/Auth/actions/creators'
import { routeActions } from 'react-router-redux'
import RevManifest from '../../app/lib/revManifest'
import EventStatus from '../features/EventEdit/eventStatus.js'

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

	unpublishEvent() {
		const { dispatch, event } = this.props
		dispatch(PreviewActionCreators.unpublishEvent({
			id: event.item.id
		}))
	}

	getPublishSection() {
		const { item, isSaving, errors } = this.props.event
		switch (item.status) {
			case EventStatus('published'):
				return (
					<Column s='medium-5' a='right' className="">
						<span className="publishedLabel">
							<img src={`/images/${RevManifest('check-gray.png')}`} className="publishedButtonCheckmark"/>Published
						</span>&nbsp;
						<a className='solid-button gray' onClick={::this.unpublishEvent}>Unpublish</a>
					</Column>
				)

			case EventStatus('draft'):
				return (
					<Column s='medium-5' a='right'>
						<a className='solid-button gray' onClick={::this.handleSave} disabled={errors.hasError || isSaving}>{ isSaving ? 'Saving...' : 'Save as Draft' }</a>
					</Column>
				)

			case EventStatus('live'):
			default:
				return (
					<Column s='medium-5' a='right'>
						<a className='solid-button red' disabled={true}>{item.status.toUpperCase()}</a>
					</Column>
				)
		}

	}

	render() {
		const { event, auth } = this.props

		var ContentNav = null
		if (event) {
			const { isSaving, errors } = event
			ContentNav = <Row>
						<Column s='medium-7'>
							<EventEditNav {...this.props} />
						</Column>

						{::this.getPublishSection()}
					</Row>
		}

		return (
			<div className='event-header'>
				<Row>
					<Column s='medium-4'>{event ?
						<a onClick={::this.handleCancel}>Cancel</a> :
						<span className="yv-title"><img src={`/images/${RevManifest('YouVersion.png')}`} /></span>
					}</Column>

					<Column s='medium-4' a='center'>
						EVENT BUILDER
					</Column>

					<Column s='medium-4' a='right'>
						{(auth && auth.userData && auth.userData.first_name) ? auth.userData.first_name : ''} {(auth && auth.userData && auth.userData.last_name) ? auth.userData.last_name : ''}&nbsp;
						{(auth && auth.userData && auth.userData.first_name) ? <a onClick={::this.handleLogout}>Sign Out</a> : <a target='_blank' href='https://www.bible.com/sign-up'>Create Account</a>}
					</Column>
				</Row>
				{ContentNav}
			</div>
		)
	}
}

export default EventHeader
