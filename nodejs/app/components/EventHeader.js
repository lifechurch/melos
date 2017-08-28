import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import Row from './Row'
import Column from './Column'
import EventEditNav from '../features/EventEdit/components/EventEditNav'
import ActionCreators from '../features/EventEdit/features/details/actions/creators'
import PreviewActionCreators from '../features/EventEdit/features/preview/actions/creators'
import AuthActionCreators from '../features/Auth/actions/creators'
import CheckGrayImage from '../../images/check-gray.png'
import YouVersionImage from '../../images/YouVersion.png'
import EventStatus from '../features/EventEdit/eventStatus'

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
					<div className='text-right right'>
						<span className="publishedLabel">
							<img src={CheckGrayImage} className="publishedButtonCheckmark" />
							<FormattedMessage id="components.EventHeader.status.published" />
						</span>&nbsp;
						<a className='solid-button gray' onClick={::this.unpublishEvent}>
							<FormattedMessage id="components.EventHeader.unpublish" />
						</a>
					</div>
				)

			case EventStatus('draft'):
				return (
					<div className='text-right right'>
						<a className='solid-button gray' onClick={::this.handleSave} disabled={errors.hasError || isSaving || isReordering}>{ isSaving ? <FormattedMessage id="components.EventHeader.saving" /> : <FormattedMessage id="components.EventHeader.saveAsDraft" /> }</a>
					</div>
				)

			case EventStatus('live'):
			default:
				return (
					<div className='text-right right'>
						<a className='solid-button red' disabled={true}>{intl.formatMessage({ id: `components.EventHeader.status.${item.status.toLowerCase()}` })}</a>
					</div>
				)
		}

	}

	render() {
		const { event, auth, params } = this.props

		let ContentNav = null
		if (event) {
			const { isSaving, errors } = event
			ContentNav = (<Row>
				<div className='text-left left'>
					<EventEditNav {...this.props} />
				</div>

				{::this.getPublishSection()}
			</Row>)
		}

		return (
			<div className='event-header'>
				<Row>
					<Column s='medium-4'>{event ?
						<a onClick={::this.handleCancel}>&larr; <FormattedMessage id="components.EventHeader.myEvents" /></a> :
						<span className="yv-title"><img src={YouVersionImage} /></span>
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
