import React, { Component, PropTypes } from 'react'

class Languages extends Component {
	constructor(props) {
		super(props)
		const { initialSelection } = props
		this.state = { selectedLanguage: initialSelection || null }
	}

	languageSelect(language_tag) {
		const { onSelect } = this.props
		this.setState( { selectedLanguage: language_tag } )
		if (typeof onSelect == 'function') {
			onSelect(language_tag)
		}
	}

	render() {
		const { list, onSelect, header } = this.props
		const { selectedLanguage } = this.state

		let languages = null

		if (Array.isArray(list)) {
			let languageList = list.map((language) =>  {
				return( (<li key={language.id} className={ (language.language_tag == selectedLanguage) ? 'active' : ''} onClick={this.languageSelect.bind(this, language.language_tag)}>{ language.name }</li>) )
			})
			/* the header would either be the all or recently used */
			languages = (
				<div className='language-list'>
					<p className='language-header'>{ header }</p>
					<ul>{ languageList }</ul>
				</div>
			)
		}

		return (
			<div>
				{ languages }
			</div>
		)
	}
}


/**
 * 		@list					  			array of language objects for listing langs
 * 		@header								bold header for language list–either recently used or all
 * 		@onSelect			  			function to call when selecting language
 * 		@initialSelection	   	language_tag for highlighting currently selected language
 */
Languages.propTypes = {
	list: React.PropTypes.array,
	header: React.PropTypes.string,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.string
}

export default Languages