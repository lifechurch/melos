import React, { Component, PropTypes } from 'react'
import Row from '../../../../app/components/Row'
import Column from '../../../../app/components/Column'
import { Link } from 'react-router'
import ActionCreators from '../features/details/actions/creators'

class EventEditNav extends Component {

	handleDetailsNext(clickEvent) {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.saveDetails(event.item, true))
	}

	render() {
		const { params, routing, event } = this.props

		if (!params.hasOwnProperty("id")) {
			params.id = null
		}

		function locationsClassname() {
			return (routing.location.pathname === '/event/edit/' + params.id + '/locations_and_times') ? 'active small button' : 'small button'
		}

		function detailsClassname() {
			return (routing.location.pathname === '/event/edit/' + params.id) ? 'active small button' : 'small button'
		}

		function contentClassname() {
			return (routing.location.pathname === '/event/edit/' + params.id + '/content') ? 'active small button' : 'small button'
		}

		function previewClassname() {
			return (routing.location.pathname === '/event/edit/' + params.id + '/preview') ? 'active small button' : 'small button'
		}

		function shareClassname() {
			return (routing.location.pathname === '/event/edit/' + params.id + '/share') ? 'active small button' : 'small button'
		}

		return (
			<ul className='event-edit-nav button-group small radius'>
				<li><Link disabled={!event.rules.details.canView || event.isReordering} className={detailsClassname()} to={`/event/edit/${params.id}`}>Details</Link></li>
				<li><a disabled={!event.rules.locations.canView || event.isReordering} className={locationsClassname()} onClick={::this.handleDetailsNext}>Locations & Times</a></li>
				<li><Link disabled={!event.rules.content.canView || event.isReordering} className={contentClassname()} to={`/event/edit/${params.id}/content`}>Content</Link></li>
				<li><Link disabled={!event.rules.preview.canView || event.isReordering} className={previewClassname()} to={`/event/edit/${params.id}/preview`}>Preview & Publish</Link></li>
				<li><Link disabled={!event.rules.share.canView || event.isReordering} className={shareClassname()} to={`/event/edit/${params.id}/share`}>Share</Link></li>
			</ul>
		)
	}
}

EventEditNav.propTypes = {
	params: PropTypes.object.isRequired
}

export default EventEditNav
