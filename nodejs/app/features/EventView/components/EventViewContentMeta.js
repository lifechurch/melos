import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard'
import EventViewContentText from './EventViewContentText'
import EventViewContentLink from './EventViewContentLink'
import EventViewContentImage from './EventViewContentImage'

class EventViewContentMeta extends Component {

	constructor(props) {
		super(props)

		this.state = { isCopied: false }
	}

	handleShare(e) {
		// http://www.addthis.com/academy/what-is-address-bar-sharing-analytics/
		var addthis_config = addthis_config || {}
		addthis_config.data_track_addressbar = false

		e.target.nextSibling.classList.toggle('show')
	}

	handleCopy() {
		this.setState({ isCopied: true })
		window.setTimeout(() => { this.setState({ isCopied: false }) }, 2000)
	}

	render() {
		const { meta_links, intl } = this.props

		const links = meta_links.map((ml, i) => {
			switch (ml.label) {
				case intl.formatMessage({ id: 'features.EventView.components.EventViewContent.read' }):
					return (
						<a key={i} href={ml.payload}>{ml.label}</a>
					)
					break

				case intl.formatMessage({ id: 'features.EventView.components.EventViewContent.readPlan' }):
					return (
						<a key={i} href={ml.payload} className="plan">{ml.label}</a>
					)
					break

				case intl.formatMessage({ id: 'features.EventView.components.EventViewContent.share' }):
					return (
						<div key={i}>
							<a onClick={::this.handleShare}>{ml.label}</a>
							<div className="addthis_sharing_toolbox" data-url={ml.payload.url} data-title={ml.payload.title} />
						</div>
					)
					break

				case intl.formatMessage({ id: 'features.EventView.components.EventViewContent.copy' }):
					return (
						<CopyToClipboard key={i} onCopy={::this.handleCopy} text={ml.payload}>
							<a>{this.state.isCopied ? intl.formatMessage({ id: 'features.EventView.components.EventViewContent.copied' }) : ml.label}</a>
						</CopyToClipboard>
					)
					break

				default:
					return <a key={i} target="_blank" href={ml.payload}>{ml.label}</a>
			}
		})

		return (
			<div className="meta clearfix">{links}</div>
		)
	}
}

export default EventViewContentMeta
