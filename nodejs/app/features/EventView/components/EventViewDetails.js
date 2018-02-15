import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Image from '../../../components/Image'
import ActionCreators from '../actions/creators'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import ShareImage from '../../../../images/share.png'

class EventViewDetails extends Component {
	saveEvent() {
		const { dispatch, event } = this.props
		dispatch(ActionCreators.saveNote({ id: event.item.id }))
	}

	toggleLocations(e) {
		const { intl } = this.props
		const loc = e.currentTarget.childNodes
		loc[1].text = loc[1].text == intl.formatMessage({ id: 'features.EventView.components.EventViewDetails.expand' }) ? intl.formatMessage({ id: 'features.EventView.components.EventViewDetails.collapse' }) : intl.formatMessage({ id: 'features.EventView.components.EventViewDetails.expand' })
		loc[2].classList.toggle('show')
	}

	handleShare(e) {
		// http://www.addthis.com/academy/what-is-address-bar-sharing-analytics/
		var addthis_config = addthis_config || {}
		addthis_config.data_track_addressbar = false

		e.currentTarget.nextSibling.classList.toggle('show')
	}

	render() {
		const { event, auth, intl } = this.props
		const { org_name, title, images, description, locations } = event.item

		var action = <div className="right">{ auth.isLoggedIn ? <a onClick={::this.saveEvent} className="solid-button green"><FormattedMessage id="features.EventView.components.EventViewDetails.save" /></a> : <a href="/sign-in" className="solid-button green"><FormattedMessage id="features.EventView.components.EventViewDetails.signIn" /></a>}</div>
		if (event.isSaved) {
			var action = <div className="right"><a className="solid-button gray"><FormattedMessage id="features.EventView.components.EventViewDetails.saved" /></a></div>
		}

		const locationList = Object.keys(locations).map((l) => {
			const name = locations[l].name ? <div className='location name'>{locations[l].name}</div> : null
			const address = <div className='location address'>{locations[l].formatted_address}</div>
			return (
				<li key={l}>
					{name}
					{address}
					<div className="times">{locations[l].times.map((t) => { return moment.tz(t.start_dt, locations[l].timezone).format('dddd h:mm A') }).join(', ')}</div>
				</li>
			)
		})

		return (
			<div className="details">
				<div className="org-bar">
					<div className="right">
						<a className="share-icon" onClick={::this.handleShare}><img src={ShareImage} /></a>
						<div className="addthis_sharing_toolbox" data-url={event.item.short_url} data-title={event.item.title} />
					</div>
					<div className="org">{org_name}</div>
				</div>
				{ images ? <Image className="hero" images={images} width={640} height={360} /> : null }
				<div className="title-bar">
					{action}
					<div className="title">{title}</div>
				</div>
				<div className="desc">{description}</div>
				<div className="type no-meta">
					<div className="content locations" onClick={::this.toggleLocations}>
						<div className='title left'>{intl.formatMessage({ id: 'features.EventEdit.components.EventEditNav.locations' })}</div>
						<a ref="toggle" className='toggle right'>{intl.formatMessage({ id: 'features.EventView.components.EventViewDetails.expand' })}</a>
						<div className="caption">
							<ul>{locationList}</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

EventViewDetails.propTypes = {
	// item: PropTypes.object.isRequired,
	// dispatch: PropTypes.func.isRequired,
	// handleDuplicate: PropTypes.func.isRequired,
	// index: PropTypes.number.isRequired,
	// startOffset: PropTypes.number
}

export default EventViewDetails
