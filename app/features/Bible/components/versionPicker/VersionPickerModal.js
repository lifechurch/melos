import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Languages from './Languages'
import Versions from './Versions'

class VersionPickerModal extends Component {

	render() {

		const {
			languageList,
			versionList,
			versionsMap,
			recentLanguages,
			recentVersions,
			usfm,
			getLanguage,
			handleChange,
			handleKeyDown,
			selectedLanguage,
			selectedVersion,
			classes,
			toggle,
			versionlistSelectionIndex,
			onMouseOver,
			alert,
			inputValue,
			versionsLanguageName,
			versionFiltering,
			intl,
			cancel
		} = this.props

		let languages, versionBlock = null

		// apply the correct mobile class from the click handlers passed down
		let classNames = (classes) ? `version-picker-modal ${classes}` : 'version-picker-modal'


		if (languageList) {
			languages = (
				<div className='language-container'>
					<div className='header vertical-center horizontal-center'>
						<a className='prev columns medium-4' onClick={toggle}><p>&larr;</p></a>
						<p className='columns'><FormattedMessage id="Reader.versionpicker.language label" /></p>
						<a className='cancel columns medium-4' onClick={cancel}><FormattedMessage id="Reader.header.cancel" /></a>
					</div>
					<div className='filter-langs'>
						<input value={inputValue} onChange={handleChange.bind(this)} placeholder={intl.formatMessage({ id: 'Reader.versionpicker.filter languages' })} />
					</div>
					<div className='language-list'>
						<Languages list={languageList} onSelect={getLanguage} initialSelection={selectedLanguage} header='All'/>
					</div>
				</div>
			)
		}

		if (versionList && selectedLanguage) {
			let versionFocus = false
			let versions = null
			let alertClass = alert ? 'picker-alert' : ''
			// if we're filtering the version list, let's handle the list selection stuff
			// this tells the versions component to fire onMouseOver and style the focus list element
			if (versionFiltering) {
				versionFocus = true
				versions = (
					<div className='version-list'>
						<Versions
							params={this.props.params}
							list={versionList}
							usfm={usfm}
							initialSelection={selectedVersion}
							listSelectionIndex={versionlistSelectionIndex}
							focus={versionFocus}
							onMouseOver={onMouseOver}
							localizedLink={this.props.localizedLink}
						/>
					</div>
				)
			} else {
				versions = (
					<div className='version-list'>
						{
							recentVersions && Object.keys(recentVersions).length > 0
							?
							<Versions
								params={this.props.params}
								list={recentVersions}
								usfm={usfm}
								initialSelection={selectedVersion}
								header={intl.formatMessage({ id: 'Reader.header.recent versions' })}
								localizedLink={this.props.localizedLink}
							/>
							:
							null
						}
						<Versions
							params={this.props.params}
							list={versionList}
							map={versionsMap}
							usfm={usfm}
							initialSelection={selectedVersion}
							header={versionsLanguageName}
							localizedLink={this.props.localizedLink}
						/>
					</div>
				)
			}

			versionBlock = (
				<div className={`version-container ${alertClass}`}>
					<div className='header vertical-center horizontal-center'><FormattedMessage id="Reader.versionpicker.version label" /></div>
					{/* this is hidden on default and only shown if mobile */}
					<div className='change-language'>
						<span className='language-name'><small>{intl.formatMessage({ id: 'Reader.versionpicker.language sub-label'})}</small>{versionsLanguageName}</span>
						<div className='language-button' onClick={toggle}><FormattedMessage id="Reader.versionpicker.change language" /></div>
					</div>
					{/* this is hidden on default and only shown if picker alert is applied to the parent */}
					<div className='picker-error'>
						<FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
					</div>
					{ versions }
				</div>
			)
		}


		return (
			<div className={classNames} >
				{ languages }
				{ versionBlock }
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
 *	@classes										classes to apply. for showing and hiding on mobile views
 *	@toggle											function to call on prev arrow click on language header to show languages
 * 	@languagelistSelectionIndex index for selecting list element with arrow keys
 * 	@versionlistSelectionIndex 	index for selecting list element with arrow keys
 * 	@onMouseOver								function to call when hovering over list element
 * 	@alert											show alert message
 * 	@versionFiltering 					are we filtering versions?
 *
 */
VersionPickerModal.propTypes = {
	languageList: React.PropTypes.array,
	versionList: React.PropTypes.object,
	recentLanguages: React.PropTypes.array,
	recentVersions: React.PropTypes.object,
	selectedLanguage: React.PropTypes.string,
	selectedVersion: React.PropTypes.number,
	getLanguage: React.PropTypes.func,
	handleChange: React.PropTypes.func,
	handleKeyDown: React.PropTypes.func,
	classes: React.PropTypes.string,
	toggle: React.PropTypes.func,
	languagelistSelectionIndex: React.PropTypes.number,
	versionlistSelectionIndex: React.PropTypes.number,
	onMouseOver: React.PropTypes.func,
	alert: React.PropTypes.bool,
	versionFiltering: React.PropTypes.bool
}

export default VersionPickerModal