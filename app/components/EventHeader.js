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
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

class EventHeader extends Component {
	handleCancel() {
		const { dispatch, params } = this.props
		dispatch(ActionCreators.cancel(params.locale))
	}

	handleSave() {
		const { event, dispatch, params } = this.props
		dispatch(ActionCreators.saveDetails(event.item, false, params.locale))
	}

	handleLogout() {
		const { dispatch, params } = this.props
		dispatch(AuthActionCreators.logout(params.locale))
	}

	unpublishEvent() {
		const { dispatch, event } = this.props
		dispatch(PreviewActionCreators.unpublishEvent({
			id: event.item.id
		}))
	}

	getPublishSection() {
		const { item, isSaving, isReordering, errors } = this.props.event
		const { intl } = this.props
		switch (item.status) {
			case EventStatus('published'):
				return (
					<Column s='medium-5' a='right' className="">
						<span className="publishedLabel">
							<img src={`/images/${RevManifest('check-gray.png')}`} className="publishedButtonCheckmark"/>
							<FormattedMessage id="components.EventHeader.status.published" />
						</span>&nbsp;
						<a className='solid-button gray' onClick={::this.unpublishEvent}>
							<FormattedMessage id="components.EventHeader.unpublish" />
						</a>
					</Column>
				)

			case EventStatus('draft'):
				return (
					<Column s='medium-5' a='right'>
						<a className='solid-button gray' onClick={::this.handleSave} disabled={errors.hasError || isSaving || isReordering}>{ isSaving ? <FormattedMessage id="components.EventHeader.saving" /> : <FormattedMessage id="components.EventHeader.saveAsDraft" /> }</a>
					</Column>
				)

			case EventStatus('live'):
			default:
				return (
					<Column s='medium-5' a='right'>
						<a className='solid-button red' disabled={true}>{intl.formatMessage({id:'components.EventHeader.status.' + item.status.toLowerCase() })}</a>
					</Column>
				)
		}

	}

	render() {
		const { event, auth, params } = this.props

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
						<a onClick={::this.handleCancel}>&larr; <FormattedMessage id="components.EventHeader.myEvents" /></a> :
						<span className="yv-title"><img src={`/images/${RevManifest('YouVersion.png')}`} /></span>
					}</Column>

					<Column s='medium-4' a='center'>
						<FormattedMessage id="components.EventHeader.eventBuilder" />
					</Column>

					<Column s='medium-4' a='right'>
						{(auth && auth.userData && auth.userData.first_name) ? auth.userData.first_name : ''} {(auth && auth.userData && auth.userData.last_name) ? auth.userData.last_name : ''}&nbsp;
						{(auth && auth.userData) ? <a onClick={::this.handleLogout}><FormattedMessage id="components.EventHeader.signOut" /></a> : <a target='_blank' href='https://www.bible.com/sign-up'><FormattedMessage id="components.EventHeader.createAccount" /></a>}
						&nbsp;&bull;&nbsp;<Link to={`/${params.locale}/select_language`}><FormattedMessage id="features.EventEdit.features.content.components.ContentTypeReference.language" /></Link>
					</Column>
				</Row>
				{ContentNav}
			</div>
		)
	}
}

export default EventHeader
