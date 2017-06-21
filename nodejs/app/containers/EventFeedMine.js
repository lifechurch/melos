import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import EventHeader from '../components/EventHeader'
import { fetchEventFeedMine } from '../actions'
import { Link } from 'react-router'
import Row from '../components/Row'
import Column from '../components/Column'
import EventListItem from '../features/EventFeedMine/components/EventListItem'
import ActionCreators from '../features/EventFeedMine/actions/creators'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'


class EventFeedMine extends Component {
	componentWillMount() {
		const { dispatch, page } = this.props
		dispatch(fetchEventFeedMine({ page }))
		dispatch(ActionCreators.configuration())
	}

	handleDuplicate(id) {
		const { dispatch, params } = this.props
		dispatch(ActionCreators.duplicate({ id }, params.locale))
	}

	handleDelete(id, index) {
		const { dispatch } = this.props
		dispatch(ActionCreators.delete(id, index))
	}

	getPage(e) {
		const { dispatch } = this.props
		dispatch(fetchEventFeedMine({ page: parseInt(e.target.dataset.page) }))
	}

	render() {
		const { dispatch, hasError, errors, isFetching, configuration, items, page, next_page, auth, intl, params } = this.props
		const { userData } = auth
		const { first_name, last_name } = userData

		const itemList = items.map((item, index) => {
			return (<EventListItem
				key={item.id}
				item={item}
				handleDuplicate={::this.handleDuplicate}
				handleDelete={::this.handleDelete}
				index={index}
				dispatch={dispatch}
				params={params}
				startOffset={configuration.startOffset}
			/>)
		})

		let eventFeed
		if (itemList.length) {
			let pagination = null

			if (page > 1 || next_page) {
				pagination = (<div className="pagination">
					{page > 1 ? <a className="page left" onClick={::this.getPage} data-page={page - 1}><FormattedHTMLMessage id="containers.EventFeedMine.previous" /></a> : null}
					{next_page ? <a className="page right" onClick={::this.getPage} data-page={next_page}><FormattedHTMLMessage id="containers.EventFeedMine.next" /></a> : null}
				</div>)
			}

			eventFeed = (
				<div>
					<div className="event-title-section">
						<Row className="collapse">
							<Column s="medium-8" a="left">
								<div className="title"><FormattedMessage id="containers.EventFeedMine.title" /></div>
							</Column>
							<Column s="medium-4" a="right">
								<Link className="solid-button green create" to={`/${params.locale}/event/edit`}><FormattedMessage id="containers.EventFeedMine.new" /></Link>
							</Column>
						</Row>
						<Row>
							<h2 className="subtitle"><FormattedMessage id="containers.EventFeedMine.subTitle" /></h2>
						</Row>
					</div>
					<ul className="unindented">
						<ReactCSSTransitionGroup transitionName='content' transitionEnterTimeout={250} transitionLeaveTimeout={250}>
							{itemList}
						</ReactCSSTransitionGroup>
					</ul>
					{pagination}
				</div>
			)

		} else {
			eventFeed = (
				<div className='event-title-section no-content-prompt text-center'>
					<div className="title"><FormattedMessage id="containers.EventFeedMine.title" /></div>
					<div className="create-wrapper">
						<Link className="solid-button green create" to={`/${params.locale}/event/edit`}><FormattedMessage id="containers.EventFeedMine.newFirst" /></Link>
					</div>
					<a className="learn" target="_blank" href="https://help.youversion.com/customer/en/portal/articles/1504122-how-to-create-an-event-on-bible-com-administrator-?b_id=203"><FormattedMessage id="containers.EventFeedMine.learn" /></a>
				</div>
			)
		}

		return (
			<div className="medium-10 large-7 columns small-centered">
				<Helmet title={intl.formatMessage({ id: 'containers.EventFeedMine.title' })} />
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

export default connect(mapStateToProps, null)(injectIntl(EventFeedMine))
