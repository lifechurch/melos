import React, { Component } from 'react'
import Row from './Row'
import Column from './Column'
import EventEditNav from '../features/EventEdit/components/EventEditNav'
import ActionCreators from '../features/EventEdit/features/details/actions/creators'
import AuthActionCreators from '../features/Auth/actions/creators'
import { routeActions } from 'react-router-redux'
import RevManifest from '../../rev-manifest.json'

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

	getPublishSection(pathname) {
		const { isSaving, errors } = this.props.event
		if (pathname.split('/').pop() == "share") {
			return <Column s='medium-7' a='right' className="">
				<span className="publishedLabel"><img src={`/images/${RevManifest['check.png']}`} className="publishedButtonCheckmark"/>Published</span>&nbsp;
				<a className='solid-button gray'>Unpublish</a>
			</Column>
		}
		return <Column s='medium-5' a='right'>
			<a className='solid-button gray' onClick={::this.handleSave} disabled={errors.hasError || isSaving}>{ isSaving ? 'Saving...' : 'Save as Draft' }</a>&nbsp;
			<a className='solid-button green'>Publish</a>
		</Column>
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

						{::this.getPublishSection(this.props.location.pathname)}
					</Row>
		}

		if (auth.isLoggedIn) {
			return (
				<div className='event-header'>
					<Row>
						<Column s='medium-4'>{event ?
							<a onClick={::this.handleCancel}>Cancel</a> :
							<span className="yv-title">YouVersion</span>
						}</Column>

						<Column s='medium-4' a='center'>
							EVENT BUILDER
						</Column>

						<Column s='medium-4' a='right'>
							{auth.userData.first_name} {auth.userData.last_name} <a onClick={::this.handleLogout}>Sign Out</a>
						</Column>
					</Row>
					{ContentNav}
				</div>
			)
		} else {
			return null
		}
	}
}

export default EventHeader
