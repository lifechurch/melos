import React, { Component, PropTypes } from 'react'

class Languages extends Component {

	languageSelect(language, filtering) {
		const { onSelect } = this.props
		if (typeof onSelect == 'function') {
			onSelect(language, filtering)
		}
	}

	render() {
		const {
			list,
			onSelect,
			header,
			initialSelection
		} = this.props


		if (Array.isArray(list)) {
			let languageList = list.map((language, index) =>  {
				let name = (language.name == language.local_name) ? language.local_name : <span>{language.local_name}<small>{language.name}</small></span>
				let active = (language.language_tag == initialSelection) ? 'active' : ''

				return( (<li key={language.id} className={`${active}`} onClick={this.languageSelect.bind(this, language)}>{ name }</li>) )
			})
			/* the header would either be the all or recently used */
			return (
				<div className='languages'>
					<p className='language-header'>{ header }</p>
					<ul>{ languageList }</ul>
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
 * 		@list					  			array of language objects for listing langs
 * 		@header								bold header for language list–either recently used or all
 * 		@onSelect			  			function to call when selecting language
 * 		@initialSelection	   	language_tag for highlighting currently selected language
 * 		@onMouseOver					function to call when hovering over language
 * 		@listSelectionIndex 	index for selecting list element with arrow keys
 * 		@focus								allow mouse over and key actions on list items
 */
Languages.propTypes = {
	list: React.PropTypes.array,
	header: React.PropTypes.string,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.string,
	onMouseOver: React.PropTypes.func,
	listSelectionIndex: React.PropTypes.number,
	focus: React.PropTypes.bool
}

export default Languages