import React, { Component, PropTypes } from 'react'

class Versions extends Component {
	constructor(props) {
		super(props)
		const { initialSelection } = props
		this.state = { selectedVersion: initialSelection || null }
	}

	versionSelect(versionID) {
		const { onSelect } = this.props
		this.setState( { selectedVersion: versionID } )
		if (typeof onSelect == 'function') {
			onSelect(versionID)
		}
	}

	render() {
		const { list, onSelect, header } = this.props
		const { selectedVersion } = this.state

		if (list) {
			let versionList = []
			Object.keys(list).forEach((id) =>  {
				let version = list[id]
				versionList.push( (<li key={id} className={ (id == selectedVersion) ? 'active' : ''}><a onClick={this.versionSelect.bind(this, version.id)}>{ `${version.abbreviation.toUpperCase()} ${version.title}` }</a></li>) )
			})
			/* the header would either be the language title or recently used */
			return (
				<div className='version-list'>
					<p className='version-header'>{ header }</p>
					<ul>{ versionList }</ul>
				</div>
			)
		} else {
			return (
				<div></div>
			)
		}

	}
}


/**
 * 		@list					  			object of version objects for the specific language
 * 		@header								bold header for version list–either language title or recently used
 * 		@onSelect			  			function to call when selecting version
 * 		@initialSelection	   	id for highlighting currently selected version
 */
Versions.propTypes = {
	list: React.PropTypes.object,
	header: React.PropTypes.string,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.number
}

export default Versions