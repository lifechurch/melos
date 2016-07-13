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
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Carousel from '../components/Carousel/Carousel'


class EventFeedMine extends Component {
	componentWillMount() {
		const { dispatch, page } = this.props
		dispatch(fetchEventFeedMine({page}))
		dispatch(ActionCreators.configuration())
	}

	handleDuplicate(id) {
		const { dispatch, params } = this.props
		dispatch(ActionCreators.duplicate({id}, params.locale))
	}

	handleDelete(id, index) {
		const { dispatch } = this.props
		dispatch(ActionCreators.delete(id, index))
	}

	getPage(e) {
		const { dispatch } = this.props
		dispatch(fetchEventFeedMine({page: parseInt(e.target.dataset.page)}))
	}

	render() {
		const { dispatch, hasError, errors, isFetching, configuration, items, page, next_page, auth, intl, params } = this.props
		const { userData } = auth
		const { first_name, last_name } = userData



		var data = {
    "response": {
        "buildtime": "2016-07-12T20:37:08.676083+00:00",
        "code": 200,
        "data": {
            "collections": [
                {
                    "items": [
                        {
                            "title": "Anxiety",
                            "gradient": {
                                "colors": [
                                    [
                                        "166828",
                                        0
                                    ],
                                    [
                                        "1a792e",
                                        0.5
                                    ],
                                    [
                                        "1e8b35",
                                        1
                                    ]
                                ],
                                "angle": 45
                            },
                            "slug": "anxiety-en",
                            "image_id": null,
                            "id": 4,
                            "type": "collection",
                            "display": "standard"
                        },
                        {
                            "title": "Love",
                            "gradient": {
                                "colors": [
                                    [
                                        "903a3a",
                                        0
                                    ],
                                    [
                                        "a44242",
                                        0.5
                                    ],
                                    [
                                        "b94a4a",
                                        1
                                    ]
                                ],
                                "angle": 45
                            },
                            "slug": "love-en",
                            "image_id": null,
                            "id": 3,
                            "type": "collection",
                            "display": "standard"
                        },
                        {
                            "title": "Healing",
                            "gradient": {
                                "colors": [
                                    [
                                        "693972",
                                        0
                                    ],
                                    [
                                        "7b4385",
                                        0.5
                                    ],
                                    [
                                        "8c4c98",
                                        1
                                    ]
                                ],
                                "angle": 45
                            },
                            "slug": "healing-en",
                            "image_id": null,
                            "id": 7,
                            "type": "collection",
                            "display": "standard"
                        },
                        {
                            "title": "Anger",
                            "gradient": {
                                "colors": [
                                    [
                                        "c38321",
                                        0
                                    ],
                                    [
                                        "ee9438",
                                        0.5
                                    ],
                                    [
                                        "e2f000",
                                        1
                                    ]
                                ],
                                "angle": 45
                            },
                            "slug": "anger-en",
                            "image_id": null,
                            "id": 5,
                            "type": "collection",
                            "display": "standard"
                        },
                        {
                            "title": "Depression",
                            "gradient": {
                                "colors": [
                                    [
                                        "31517b",
                                        0
                                    ],
                                    [
                                        "3a5e90",
                                        0.5
                                    ],
                                    [
                                        "426ca4",
                                        1
                                    ]
                                ],
                                "angle": 45
                            },
                            "slug": "depression-en",
                            "image_id": null,
                            "id": 6,
                            "type": "collection",
                            "display": "standard"
                        }
                    ],
                    "next_page": null,
                    "total": 5,
                    "id": 8,
                    "has_collections": true
                }
            ]
        }
    }
}



		var itemList = items.map((item, index) => {
			return (<EventListItem
					key={item.id}
					item={item}
					handleDuplicate={::this.handleDuplicate}
					handleDelete={::this.handleDelete}
					index={index}
					dispatch={dispatch}
					params={params}
					startOffset={configuration.startOffset} />)
		})

		var eventFeed
		if (itemList.length) {
			var pagination = null

			if (page > 1 || next_page) {
				pagination = <div className="pagination">
	                {page > 1 ? <a className="page left" onClick={::this.getPage} data-page={page - 1}><FormattedHTMLMessage id="containers.EventFeedMine.previous" /></a> : null}
	                {next_page ? <a className="page right" onClick={::this.getPage} data-page={next_page}><FormattedHTMLMessage id="containers.EventFeedMine.next" /></a> : null}
	            </div>
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
				<Helmet title={intl.formatMessage({ id: "containers.EventFeedMine.title" })} />
				<EventHeader {...this.props} />
				{eventFeed}
			<Carousel carouselContent={data.response.data.collections} carouselType='gradient'/>
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
