import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

class Versions extends Component {
	constructor(props) {
		super(props)
		this.state = { selectedVersion: props.initialSelection || null }
	}

	versionSelect(versionID) {
		this.setState( { selectedVersion: versionID } )
		if (typeof this.props.onSelect == 'function') {
			this.props.onSelect(versionID)
		}
	}

	render() {
		const { recentlyUsed, list, onSelect } = this.props

		let versions, recents = null

		if (recentlyUsed) {
			let recentList = []
			Object.keys(recentlyUsed).forEach((id) =>  {
				let recent = recentlyUsed[id]
				recentList.push( (<li key={id} className={ (id == this.state.selectedVersion) ? 'active' : ''}><a onClick={this.versionSelect.bind(this, recent.id)}>{ `${version.abbreviation.toUpperCase()} ${version.title}` }</a></li>) )
			})
			recents = (
				<div className='recentsContainer'>
					<p className='version-header'><FormattedMessage id="recent versions"/></p>
					<ul>{ recentList }</ul>
				</div>
			)
		}
		if (list) {
			let versionList = []
			Object.keys(list).forEach((id) =>  {
				let version = list[id]
				versionList.push( (<li key={id} className={ (id == this.state.selectedVersion) ? 'active' : ''}><a onClick={this.versionSelect.bind(this, version.id)}>{ `${version.abbreviation.toUpperCase()} ${version.title}` }</a></li>) )
			})
			versions = (
				<div className='versionsContainer'>
					<p className='version-header'>{ list[Object.keys(list)[0]].language.name }</p>
					<ul>{ versionList }</ul>
				</div>
			)
		}

		return (
			<div className='version-list'>
				{ recents }
				{ versions }
			</div>
		)
	}
}


/**
 * 		@list					  			object of version objects for the specific language
 * 		@recentlyUsed					object of recent version objects for displaying the 5 most recent
 * 		@onSelect			  			function to call when selecting version
 * 		@initialSelection	   	id for highlighting currently selected version
 */
Versions.propTypes = {
	list: React.PropTypes.object,
	recentlyUsed: React.PropTypes.array,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.number
}

export default Versions