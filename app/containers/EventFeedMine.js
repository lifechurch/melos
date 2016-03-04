import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import EventHeader from '../components/EventHeader'
import { fetchEventFeedMine } from '../actions'
import { Link } from 'react-router'
import RevManifest from '../../app/lib/revManifest'
import Row from '../components/Row'
import Column from '../components/Column'
import EventListItem from '../features/EventFeedMine/components/EventListItem'
import ActionCreators from '../features/EventFeedMine/actions/creators'
import NoticeBanner from '../components/NoticeBanner'

class EventFeedMine extends Component {
	componentWillMount() {
		const { dispatch, page } = this.props
		dispatch(fetchEventFeedMine({page}))
		dispatch(ActionCreators.configuration())
	}

	handleDuplicate(id) {
		const { dispatch } = this.props
		dispatch(ActionCreators.duplicate({id}))
	}

	getPage(e) {
		const { dispatch } = this.props
		dispatch(fetchEventFeedMine({page: parseInt(e.target.dataset.page)}))
	}

	render() {
		const { dispatch, hasError, errors, isFetching, configuration, items, page, next_page, auth } = this.props
		const { userData } = auth
		const { first_name, last_name } = userData

		var itemList = items.map((item, index) => {
			return (<EventListItem
					key={item.id}
					item={item}
					handleDuplicate={::this.handleDuplicate}
					index={index}
					dispatch={dispatch}
					startOffset={configuration.startOffset} />)
		})

		var eventFeed
		if (itemList.length) {
			var pagination = null

			if (page > 1 || next_page) {
				pagination = <div className="pagination">
	                {page > 1 ? <a className="page left" onClick={::this.getPage} data-page={page - 1}>&larr; Previous</a> : null}
	                {next_page ? <a className="page right" onClick={::this.getPage} data-page={next_page}>Next &rarr;</a> : null}
	            </div>
			}

			eventFeed = (
				<div>
	                <div className="event-title-section">
	                    <Row className="collapse">
	                        <Column s="medium-8" a="left">
	                            <div className="title">My Events</div>
	                        </Column>
	                        <Column s="medium-4" a="right">
	                            <Link className="solid-button green create" to="/event/edit">Create New Event</Link>
	                        </Column>
	                    </Row>
	                    <Row>
	                        <h2 className="subtitle">EVENTS CREATED BY ME</h2>
	                    </Row>
	                </div>
					<ul className="unindented">
						{itemList}
					</ul>
	                {pagination}
				</div>
			)

		} else {
			eventFeed = (
				<div className='event-title-section no-content-prompt text-center'>
                    <div className="title">My Events</div>
                    <div className="create-wrapper">
	                    <Link className="solid-button green create" to="/event/edit">Create Your First Event</Link>
	                </div>
                    <Link className="learn" to="http://help.youversion.com">Learn how to make a great Event</Link>
				</div>
			)
		}

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title="My Events" />
				<NoticeBanner />
				<EventHeader {...this.props} />
				{eventFeed}
			</div>
		)
	}
}

EventFeedMine.defaultProps = {
	hasError: false,
	errors: [],
	isFetching: false,
	items: []
}

function mapStateToProps(state) {
	return Object.assign({}, state.eventFeeds.mine || {
		hasError: false,
		errors: [],
		isFetching: false,
		items: []
	}, { auth: state.auth, configuration: state.configuration })
}

export default connect(mapStateToProps, null)(EventFeedMine)
