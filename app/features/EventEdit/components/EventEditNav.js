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
		const { params } = this.props

		if (!params.hasOwnProperty("id")) {
			params.id = null
		}

		return (
			<ul className='event-edit-nav button-group small radius'>
				<li><Link className='small button' activeClassName='active' to={`/event/edit/${params.id}`}>Details <span className='arrow' /></Link></li>
				<li><a className='small button' activeClassName='active' onClick={::this.handleDetailsNext}>Location & Times <span className='arrow' /></a></li>
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