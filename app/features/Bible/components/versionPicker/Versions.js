import React, { Component, PropTypes } from 'react'

class Versions extends Component {
	constructor(props) {
		super(props)
		this.state = { selectedVersion: props.initialSelection || null }
	}

	versionSelect(version) {
		this.setState( { selectedVersion: version.usfm } )
		if (typeof this.props.onSelect == 'function') {
			this.props.onSelect(version)
		}
	}

	render() {
		const { recentlyUsed, list, onSelect } = this.props

		var versions, recents = null
		if (Array.isArray(recentlyUsed)) {
			recents = recentlyUsed.map((recent) => {
				return( (<li key={version.usfm} className={ (version.usfm == this.state.selectedVersion) ? 'active' : ''}><a onClick={this.versionselect.bind(this, version)}>{ version.human }</a></li>) )
			})
		}

		if (Array.isArray(list)) {
			versions = list.map((version) =>  {
				return( (<li key={version.usfm} className={ (version.usfm == this.state.selectedVersion) ? 'active' : ''}><a onClick={this.versionselect.bind(this, version)}>{ version.human }</a></li>) )
			})
		}

		return (
			<ul className='book-list'>
				{ versions }
			</ul>
		)
	}
}


/**
 * 		@list					  			array of book objects for the current version
 * 		@onSelect			  			function to call when selecting book
 * 		@initialSelection	   	usfm for highlighting currently selected book
 */
Versions.propTypes = {
	list: React.PropTypes.array.isRequired,
	recentlyUsed: React.PropTypes.array,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.string
}

export default Versions