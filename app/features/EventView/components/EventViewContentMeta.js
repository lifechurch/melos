import React, { Component, PropTypes } from 'react'
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
		var addthis_config = addthis_config||{}
		addthis_config.data_track_addressbar = false

		e.target.nextSibling.classList.toggle('show')
	}

	handleCopy() {
		this.setState({isCopied: true})
		window.setTimeout(() => {this.setState({isCopied: false})}, 2000)
	}

	render() {
		const { meta_links } = this.props

		var links = meta_links.map((ml, i) => {
			switch (ml.label) {
				case 'Read':
					return (
						<a key={i} href={ml.payload}>{ml.label}</a>
					)
					break

				case 'Read Plan':
					return (
						<a key={i} href={ml.payload} className="plan">{ml.label}</a>
					)
					break

				case 'Share':
					return (
						<div>
							<a key={i} onClick={::this.handleShare} data-url={ml.payload.url} data-title={ml.payload.title}>{ml.label}</a>
							<div className="addthis_sharing_toolbox" data-url={ml.payload.url} data-title={ml.payload.title}></div>
						</div>
					)
					break

				case 'Copy':
					return (
				    	<CopyToClipboard onCopy={::this.handleCopy} text={ml.payload}>
							<a key={i}>{this.state.isCopied ? 'Copied' : ml.label}</a>
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
