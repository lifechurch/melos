import React, { Component, PropTypes } from 'react'

class Versions extends Component {

	versionSelect(version, filtering) {
		const { onSelect } = this.props
		if (typeof onSelect == 'function') {
			onSelect(version, filtering)
		}
	}

	render() {
		const {
			list,
			onSelect,
			header,
			initialSelection,
			focus,
			listSelectionIndex,
			onMouseOver
		} = this.props

		if (list) {
			let versionList = []
			Object.keys(list).forEach((id, index) =>  {
				let version = list[id]
				let active = (id == initialSelection) ? 'active' : ''
				if (focus) {
					console.log(listSelectionIndex)
					let focusClass = (index == listSelectionIndex) ? 'focus' : ''
					versionList.push( (<li key={id} className={`${active} ${focusClass}`} onClick={this.versionSelect.bind(this, version)} onMouseOver={onMouseOver.bind(this, "versions", index)}>{ `${version.abbreviation.toUpperCase()} ${version.title}` }</li>) )
				} else {
					versionList.push( (<li key={id} className={`${active}`} onClick={this.versionSelect.bind(this, version)} >{ `${version.abbreviation.toUpperCase()} ${version.title}` }</li>) )
				}
			})
			/* the header would either be the language title or recently used */
			let title = header ? <p className='version-header'>{ header }</p> : null
			return (
				<div className='versions'>
					{ title }
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
 * 		@onMouseOver					function to call when hovering over version
 * 		@listSelectionIndex 	index for selecting list element with arrow keys
 * 		@focus								allow mouse over and key actions on list items
 */
Versions.propTypes = {
	list: React.PropTypes.object,
	header: React.PropTypes.string,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.number,
	onMouseOver: React.PropTypes.func,
	listSelectionIndex: React.PropTypes.number,
	focus: React.PropTypes.bool
}

export default Versions