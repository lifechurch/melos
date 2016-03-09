import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import moment from 'moment'
import EventViewContentText from './EventViewContentText'
import EventViewContentLink from './EventViewContentLink'
import EventViewContentImage from './EventViewContentImage'

class EventViewContentMeta extends Component {
	render() {
		const { meta_links } = this.props

		var links = meta_links.reverse().map((ml, i) => {
			return <a key={i} target="_blank" href="{ml.url}">{ml.label}</a>
		})

		return (
			<div className="meta">{links}</div>
		)
	}
}

export default EventViewContentMeta
