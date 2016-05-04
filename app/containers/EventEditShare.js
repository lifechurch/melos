import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import Row from '../components/Row'
import Column from '../components/Column'
import { Link } from 'react-router'
import CopyToClipboard from 'react-copy-to-clipboard'
import RevManifest from '../../app/lib/revManifest'
import moment from 'moment'
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'

class EventEditShare extends Component {

	constructor(props) {
		super(props)
		this.state = { isCopied: false }
	}

	getEventImage() {
		const { item } = this.props.event
		if (Array.isArray(item.images) && item.images.length) {
			for (let img of item.images) {
				if (img.width == 320 && img.height == 180) {
					return <img className="thumbnail" src={img.url} />
				}
			}
		}
		return null
	}

	getDates() {
		const locations = this.props.event.item.locations;
		if (locations) {
			var start = null;
			var end = null;
			for (let id in locations) {
				for (let range of locations[id].times) {
					var rangeStart = new Date(range['start_dt'])
					var rangeEnd = new Date(range['end_dt'])
					if (!start || rangeStart < start) {
						start = rangeStart
					}
					if (!end || rangeEnd > end) {
						end = rangeEnd
					}
				}
			}
			if (start && end) {
				var startDate = moment(start)
				var endDate = moment(end)
				return startDate.format("MMMM DD, YYYY") + " - " + endDate.format("MMMM DD, YYYY")
			}
		}
		return "";
	}

	handleCopyLink() {
		this.setState({isCopied: true})
		window.setTimeout(() => {this.setState({isCopied: false})}, 4000)
	}

	render() {
		const { event, intl, params } = this.props
	  const eventItem = event.item
		var interval = setInterval(function() {
			if (typeof window != 'undefined' && window.addthis
				&& window.addthis.layers && window.addthis.layers.refresh) {
				clearInterval(interval);
				window.addthis.layers.refresh()
			}
		}, 100);
		var image = ::this.getEventImage()
		return (
			<div className="medium-6 columns small-centered share">
				<Helmet title={intl.formatMessage({ id: "containers.EventEditShare.title"})} />
				<div className="page-title"><FormattedMessage id="containers.EventEditShare.subTitle" /></div>
				<div className="event">
					{image}
		    		<Link className={image ? "title" : "title center"} to={"http://bible.com/events/" + eventItem.id} target="_blank">{eventItem.title}</Link>
		    		<a className={image ? "dates" : "dates center"}>{::this.getDates()}</a>
				</div>
				<div className="actions">
					<Link className="edit" to={`/${params.locale}/event/edit/${eventItem.id}`}><img src={`/images/${RevManifest('edit.png')}`} /><FormattedMessage id="containers.EventEditShare.edit" /></Link>
					<Link className="my-events" to={`/${params.locale}/`}><FormattedMessage id="containers.EventEditShare.go" /></Link>
				</div>
				<div className="page-subtitle"><FormattedMessage id="containers.EventEditShare.share" /></div>
				<div className="details">
			    	<span className="shorturl">{"http://bible.com/events/" + eventItem.id}</span>
			    	<CopyToClipboard onCopy={::this.handleCopyLink} text={"http://bible.com/events/" + eventItem.id}>
					<a className="copy"><FormattedMessage id="containers.EventEditShare.copy" /></a>
			    	</CopyToClipboard>
			    	{this.state.isCopied ? <div ref="copyInfo" className="copy-info"><FormattedMessage id="containers.EventEditShare.copied" /></div> : null}
				</div>
				<div className="addthis_sharing_toolbox" data-url={event.item.short_url} data-title={event.item.title}></div>
				<hr />
				<Row>
					<Column s='medium-6'>
						<Link disabled={!event.rules.preview.canView} to={`/${params.locale}/event/edit/${event.item.id}/preview`}><FormattedHTMLMessage id="containers.EventEditShare.previous" /></Link>
					</Column>
					<Column s='medium-6' a='right'>
					</Column>
				</Row>
			</div>
		)
	}
}

export default injectIntl(EventEditShare)
