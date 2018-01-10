import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import CustomScroll from 'react-custom-scroll'
import localizedLink from '@youversion/utils/lib/routes/localizedLink'
import Languages from './Languages'
import Versions from './Versions'

function VersionPickerModal(props) {
	const {
		params,
		languageList,
		versionList,
		versionsMap,
		recentVersions,
		usfm,
		getLanguage,
		onChange,
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
		cancel,
		onClick,
		linkBuilder
	} = props

	let languages, versionBlock = null

	// apply the correct mobile class from the click handlers passed down
	const classNames = (classes) ? `version-picker-modal ${classes}` : 'version-picker-modal'

	if (languageList) {
		languages = (
			<div className='language-container'>
				<div className='header vertical-center horizontal-center'>
					<a tabIndex={0} className='prev columns medium-4' onClick={toggle}><p>&larr;</p></a>
					<p className='columns'><FormattedMessage id="Reader.versionpicker.language label" /></p>
					<a tabIndex={0} className='cancel columns medium-4' onClick={cancel}><FormattedMessage id="Reader.header.cancel" /></a>
				</div>
				<div className='filter-langs'>
					<input value={inputValue} onChange={onChange} placeholder={intl.formatMessage({ id: 'Reader.versionpicker.filter languages' })} />
				</div>
				<CustomScroll allowOuterScroll={false}>
					<div className='language-list'>
						<Languages
							list={languageList}
							onSelect={getLanguage}
							initialSelection={selectedLanguage}
							header={null}
						/>
					</div>
				</CustomScroll>
			</div>
		)
	}

	if (versionList && selectedLanguage) {
		let versionFocus = false
		let versions = null

		const alertClass = alert
			? 'picker-alert'
			: ''

		// if we're filtering the version list, let's handle the list selection stuff
		// this tells the versions component to fire onMouseOver and style the focus list element
		if (versionFiltering) {
			versionFocus = true
			versions = (
				<div className='version-list'>
					<Versions
						params={params}
						list={versionList}
						usfm={usfm}
						initialSelection={selectedVersion}
						listSelectionIndex={versionlistSelectionIndex}
						focus={versionFocus}
						onMouseOver={onMouseOver}
						localizedLink={localizedLink}
						onClick={onClick}
						cancel={cancel}
						linkBuilder={linkBuilder}
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
									params={params}
									list={recentVersions}
									usfm={usfm}
									initialSelection={selectedVersion}
									header={intl.formatMessage({ id: 'Reader.header.recent versions' })}
									localizedLink={localizedLink}
									onClick={onClick}
									cancel={cancel}
									linkBuilder={linkBuilder}
								/>
							:
							null
						}
					<Versions
						params={params}
						list={versionList}
						map={versionsMap}
						usfm={usfm}
						initialSelection={selectedVersion}
						header={versionsLanguageName}
						localizedLink={localizedLink}
						onClick={onClick}
						cancel={cancel}
						linkBuilder={linkBuilder}
					/>
				</div>
				)
		}

		versionBlock = (
			<div className={`version-container ${alertClass}`}>
				<div className='header vertical-center horizontal-center'><FormattedMessage id="Reader.versionpicker.version label" /></div>
				{/* this is hidden on default and only shown if mobile */}
				<div className='change-language'>
					<span className='language-name'><small>{intl.formatMessage({ id: 'Reader.versionpicker.language sub-label' })}</small>{versionsLanguageName}</span>
					<a tabIndex={0} className='language-button' onClick={toggle}><FormattedMessage id="Reader.versionpicker.change language" /></a>
				</div>
				{/* this is hidden on default and only shown if picker alert is applied to the parent */}
				<div className='picker-error'>
					<FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
				</div>
				<CustomScroll allowOuterScroll={false}>
					{ versions }
				</CustomScroll>
			</div>
		)
	}

	return (
		<div className={classNames}>
			{ languages }
			{ versionBlock }
		</div>
	)
}


/**
 *
 *	Component containing both the language and version lists, and renders the
 *	appropriate one(s) based on the given inputs
 *
 *
 *	@param languageList								array of languages to be rendered. if null, then we only render version list
 *															(as long as selectedVersion is present)
 *	@param versionList								object containing all the versions of the selected language. only renders if
 *															both the object is present and selectedLanguage is present
 *	@param selectedLanguage						the language to get the versions for (logic in parent). if this isn't present, then we won't render
 *															any versions. this is also passed down to the language list for highlighting the selected language
 *	@param selectedVersion						currently selected version, used for highlighting the version in version list
 *	@param getLanguage								function passed down to the language list to call when a language is selected
 *	@param classes										classes to apply. for showing and hiding on mobile views
 *	@param toggle											function to call on prev arrow click on language header to show languages
 * 	@param languagelistSelectionIndex index for selecting list element with arrow keys
 * 	@param versionlistSelectionIndex 	index for selecting list element with arrow keys
 * 	@param onMouseOver								function to call when hovering over list element
 * 	@param alert											show alert message
 * 	@param versionFiltering 					are we filtering versions?
 *
 */
VersionPickerModal.propTypes = {
	params: PropTypes.object,
	languageList: PropTypes.array,
	versionList: PropTypes.object,
	versionsMap: PropTypes.array,
	usfm: PropTypes.string,
	inputValue: PropTypes.string,
	versionsLanguageName: PropTypes.string,
	recentVersions: PropTypes.object,
	selectedLanguage: PropTypes.string,
	selectedVersion: PropTypes.number,
	getLanguage: PropTypes.func,
	onChange: PropTypes.func,
	classes: PropTypes.string,
	toggle: PropTypes.func,
	versionlistSelectionIndex: PropTypes.number,
	onMouseOver: PropTypes.func,
	alert: PropTypes.bool,
	versionFiltering: PropTypes.bool,
	intl: PropTypes.object,
	cancel: PropTypes.func,
	onClick: PropTypes.func,
	linkBuilder: PropTypes.func.isRequired
}

VersionPickerModal.defaultProps = {
	params: {},
	versionsMap: {},
	languageList: [],
	versionsLanguageName: null,
	usfm: null,
	versionList: {},
	recentLanguages: [],
	recentVersions: {},
	inputValue: '',
	selectedLanguage: null,
	selectedVersion: null,
	getLanguage: null,
	onChange: null,
	onKeyDown: null,
	classes: null,
	toggle: null,
	languagelistSelectionIndex: null,
	versionlistSelectionIndex: null,
	onMouseOver: null,
	alert: false,
	versionFiltering: false,
	intl: null,
	cancel: null,
	onClick: null
}

export default VersionPickerModal
