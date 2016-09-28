import React, { Component, PropTypes } from 'react'

class Versions extends Component {
	constructor(props) {
		super(props)
		this.state = { selectedVersion: props.initialSelection || null }
	}

	versionSelect(version) {
		this.setState( { selectedVersion: version.id } )
		if (typeof this.props.onSelect == 'function') {
			this.props.onSelect(version)
		}
	}

	render() {
		const { recentlyUsed, list, onSelect } = this.props

		var versions, recents = null
		if (Array.isArray(recentlyUsed)) {
			var recentList = recentlyUsed.map((recent) => {
				return( (<li key={version.id} className={ (version.id == this.state.selectedVersion) ? 'active' : ''}><a onClick={this.versionselect.bind(this, version)}>{ version.human }</a></li>) )
			})
			recents = (
				<div className='recentsContainer'>
					<h4 className='version-header'>Recently Used</h4>
					{ recentList }
				</div>
			)
		}
		console.log(list)
		if (list) {
			var versionList = Object.keys(list).forEach((version) =>  {
				return( (<li key={version.id} className={ (version.id == this.state.selectedVersion) ? 'active' : ''}><a onClick={this.versionselect.bind(this, version)}>{ version.human }</a></li>) )
			})
			versions = (
				<div className='versionsContainer'>
					<h4 className='version-header'>{ Object.keys(list)[0].name }</h4>
					{ versionList }
				</div>
			)
		}

		return (
			<ul className='version-list'>
				{ recents }
				{ versions }
			</ul>
		)
	}
}


/**
 * 		@list					  			object of version objects for the specific language
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