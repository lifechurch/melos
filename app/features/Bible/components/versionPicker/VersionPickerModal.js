import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Languages from './Languages'
import Versions from './Versions'

class VersionPickerModal extends Component {

	render() {

		const {
			languageList,
			versionList,
			recentLanguages,
			recentVersions,
			getLanguage,
			getVersion,
			handleChange,
			handleKeyDown,
			selectedLanguage,
			selectedVersion,
			classes,
			toggle,
			languagelistSelectionIndex,
			versionlistSelectionIndex,
			onMouseOver,
			alert,
			inputValue,
			versionsLanguageName
		} = this.props

		let languages, versions = null

		// apply the correct mobile class from the click handlers passed down
		let classNames = (classes) ? `version-picker-modal ${classes}` : 'version-picker-modal'


		if (languageList) {
			let languageFocus = false
			// we're filtering languages?
			if (languageList.length < 66) {
				languageFocus = true
			}
			languages = (
				<div className='language-container'>
					<div className='header vertical-center horizontal-center'>
						<a className='prev columns medium-4' onClick={toggle}><p>&larr;</p></a>
						<p className='columns medium-4'><FormattedMessage id="Reader.versionpicker.language label" /></p>
						<a className='cancel columns medium-4'><FormattedMessage id="Reader.header.cancel" /></a>
					</div>
					<div className='filter-langs'>
						<input value={inputValue} onChange={handleChange.bind(this)} onKeyDown={handleKeyDown.bind(this)} placeholder={<FormattedMessage id='Reader.versionpicker.filter languages' />} />
					</div>
					<div className='language-list'>
						<Languages list={[]} onSelect={getLanguage} initialSelection={selectedLanguage} focus={languageFocus} listSelectionIndex={languagelistSelectionIndex} onMouseOver={onMouseOver} header='Recently Used'/>
						<Languages list={languageList} onSelect={getLanguage} initialSelection={selectedLanguage} focus={languageFocus} listSelectionIndex={languagelistSelectionIndex} onMouseOver={onMouseOver} header='All'/>
					</div>
				</div>
			)
		}

		if (versionList && selectedLanguage) {
			let versionFocus = true
			let alertClass = ''
			// if we're rendering just the version list, let's handle the list selection stuff
			// this tells the versions component to fire onMouseOver and style the focus list element
			// if (!languageList) {
			// 	versionFocus = true
			// }
			if (alert) {
				alertClass = 'picker-alert'
			}
			versions = (
				<div className={`version-container ${alertClass}`}>
					<div className='header vertical-center horizontal-center'><FormattedMessage id="Reader.versionpicker.version label" /></div>
					{/* this is hidden on default and only shown if picker alert is applied to the parent */}
					<div className='picker-error'>
						<FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
					</div>
					<div className='version-list'>
						<Versions list={{}} onSelect={getVersion} initialSelection={selectedVersion} listSelectionIndex={versionlistSelectionIndex} focus={versionFocus} onMouseOver={onMouseOver} alert={alert} header='Recently Used'/>
						<Versions list={versionList} onSelect={getVersion} initialSelection={selectedVersion} listSelectionIndex={versionlistSelectionIndex} focus={versionFocus} onMouseOver={onMouseOver} alert={alert} header={versionsLanguageName}/>
					</div>
				</div>
			)
		}


		return (
			<div className={classNames} >
				{ languages }
				{ versions }
			</div>
		)
	}
}


/**
 *
 *	Component containing both the language and version lists, and renders the
 *	appropriate one(s) based on the given inputs
 *
 *
 *	@languageList								array of languages to be rendered. if null, then we only render version list
 *															(as long as selectedVersion is present)
 *	@versionList								object containing all the versions of the selected language. only renders if
 *															both the object is present and selectedLanguage is present
 *	@selectedLanguage						the language to get the versions for (logic in parent). if this isn't present, then we won't render
 *															any versions. this is also passed down to the language list for highlighting the selected language
 *	@selectedVersion						currently selected version, used for highlighting the version in version list
 *	@getLanguage								function passed down to the language list to call when a language is selected
 *	@getVersion									function passed down to the version list to call when a version is selected
 *	@classes										classes to apply. for showing and hiding on mobile views
 *	@toggle											function to call on prev arrow click on language header to show languages
 * 	@languagelistSelectionIndex index for selecting list element with arrow keys
 * 	@versionlistSelectionIndex 	index for selecting list element with arrow keys
 * 	@onMouseOver								function to call when hovering over list element
 * 	@alert											show alert message
 *
 */
VersionPickerModal.propTypes = {
	languageList: React.PropTypes.array,
	versionList: React.PropTypes.object,
	recentLanguages: React.PropTypes.array,
	recentsVersions: React.PropTypes.object,
	selectedLanguage: React.PropTypes.string,
	selectedVersion: React.PropTypes.number,
	getLanguage: React.PropTypes.func,
	getVersion: React.PropTypes.func,
	handleChange: React.PropTypes.func,
	handleKeyDown: React.PropTypes.func,
	classes: React.PropTypes.string,
	toggle: React.PropTypes.func,
	languagelistSelectionIndex: React.PropTypes.number,
	versionlistSelectionIndex: React.PropTypes.number,
	onMouseOver: React.PropTypes.func,
	alert: React.PropTypes.bool
}

export default VersionPickerModal