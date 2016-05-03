import React, { Component, PropTypes } from 'react'
import Row from '../../../../app/components/Row'
import Column from '../../../../app/components/Column'
import { Link } from 'react-router'
import ActionCreators from '../features/details/actions/creators'
import { FormattedMessage } from 'react-intl'

class EventEditNav extends Component {

	handleDetailsNext(clickEvent) {
		const { event, dispatch, params } = this.props
		dispatch(ActionCreators.saveDetails(event.item, true, params.locale))
	}

	render() {
		const { params, routing, event } = this.props

		if (!params.hasOwnProperty("id")) {
			params.id = null
		}

		function locationsClassname() {
			return (routing.location.pathname === '/' + params.locale + '/event/edit/' + params.id + '/locations_and_times') ? 'active small button' : 'small button'
		}

		function detailsClassname() {
			return (routing.location.pathname === '/' + params.locale + '/event/edit/' + params.id) ? 'active small button' : 'small button'
		}

		function contentClassname() {
			return (routing.location.pathname === '/' + params.locale + '/event/edit/' + params.id + '/content') ? 'active small button' : 'small button'
		}

		function previewClassname() {
			return (routing.location.pathname === '/' + params.locale + '/event/edit/' + params.id + '/preview') ? 'active small button' : 'small button'
		}

		function shareClassname() {
			return (routing.location.pathname === '/' + params.locale + '/event/edit/' + params.id + '/share') ? 'active small button' : 'small button'
		}

		return (
			<ul className='event-edit-nav button-group small radius'>
				<li><Link disabled={!event.rules.details.canView || event.isReordering} className={detailsClassname()} to={`/${params.locale}/event/edit/${params.id}`}><FormattedMessage id="features.EventEdit.components.EventEditNav.details" /></Link></li>
				<li><a disabled={!event.rules.locations.canView || event.isReordering} className={locationsClassname()} onClick={::this.handleDetailsNext}><FormattedMessage id="features.EventEdit.components.EventEditNav.locations" /></a></li>
				<li><Link disabled={!event.rules.content.canView || event.isReordering} className={contentClassname()} to={`/${params.locale}/event/edit/${params.id}/content`}><FormattedMessage id="features.EventEdit.components.EventEditNav.content" /></Link></li>
				<li><Link disabled={!event.rules.preview.canView || event.isReordering} className={previewClassname()} to={`/${params.locale}/event/edit/${params.id}/preview`}><FormattedMessage id="features.EventEdit.components.EventEditNav.preview" /></Link></li>
				<li><Link disabled={!event.rules.share.canView || event.isReordering} className={shareClassname()} to={`/${params.locale}/event/edit/${params.id}/share`}><FormattedMessage id="features.EventEdit.components.EventEditNav.share" /></Link></li>
			</ul>
		)
	}
}

EventEditNav.propTypes = {
	params: PropTypes.object.isRequired
}

export default EventEditNav
