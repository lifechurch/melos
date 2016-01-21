import React, { Component, PropTypes } from 'react'
import Row from '../../../../app/components/Row'
import Column from '../../../../app/components/Column'
import { Link } from 'react-router'

class EventEditNav extends Component {
	render() {
		const { params } = this.props
		if (!params.hasOwnProperty("id")) {
			params.id = null
		}

		return (
			<ul className='event-edit-nav button-group small radius'>
				<li><Link className='small button' activeClassName='active' to={`/event/edit/${params.id}`}>Details <span className='arrow' /></Link></li>
				<li><Link className='small button' activeClassName='active' to={`/event/edit/${params.id}/locations_and_times`}>Location & Times <span className='arrow' /></Link></li>
				<li><Link className='small button' activeClassName='active' to={`/event/edit/${params.id}/content`}>Content <span className='arrow' /></Link></li>
				<li><Link className='small button' activeClassName='active' to={`/event/edit/${params.id}/preview`}>Preview <span className='arrow' /></Link></li>
				<li><Link className='small button' activeClassName='active' to={`/event/edit/${params.id}/share`}>Share</Link></li>
			</ul>
		)
	}
}

EventEditNav.propTypes = {
	params: PropTypes.object.isRequired
}

export default EventEditNav