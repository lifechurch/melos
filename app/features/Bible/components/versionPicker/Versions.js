import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class Versions extends Component {

	render() {
		const {
			list,
			header,
			initialSelection,
			focus,
			usfm,
			listSelectionIndex,
			onMouseOver,
			localizedLink,
			params
		} = this.props

		if (list) {
			let versionList = []
			Object.keys(list).forEach((id, index) =>  {
				let version = list[id]
				let active = (id == initialSelection) ? 'active' : ''
				let name = version.local_title || version.title
				let abbr = version.local_abbreviation || version.abbreviation
				abbr = abbr.toLocaleUpperCase()
				if (focus) {
					let focusClass = (index == listSelectionIndex) ? 'focus' : ''
					versionList.push(
						<Link key={id} to={localizedLink(`/bible/${id}/${usfm}.${params.vabbr}`)}>
							<li className={`${active} ${focusClass}`} onMouseOver={onMouseOver.bind(this, "versions", index)}>{ `${abbr} ${name}` }</li>
						</Link>
					)
				} else {
					versionList.push(
						<Link key={id} to={localizedLink(`/bible/${id}/${usfm}.${params.vabbr}`)}>
							<li className={`${active}`} >{ `${abbr} ${name}` }</li>
						</Link>
					)
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
	initialSelection: React.PropTypes.number,
	onMouseOver: React.PropTypes.func,
	listSelectionIndex: React.PropTypes.number,
	focus: React.PropTypes.bool
}

export default Versions