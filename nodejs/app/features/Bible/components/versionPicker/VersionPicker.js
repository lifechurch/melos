import React, { Component, PropTypes } from 'react'
import { push } from 'react-router-redux'
import { injectIntl } from 'react-intl'
import Filter from '../../../../lib/filter'
import VersionPickerModal from './VersionPickerModal'
import Label from '../chapterPicker/Label'
import arrayToObject from '../../../../lib/arrayToObject'
import DropdownTransition from '../../../../components/DropdownTransition'

class VersionPicker extends Component {

	constructor(props) {
		super(props)
		const {
			version,
			languages,
			versions,
			alert
		} = props

		this.state = {
			selectedLanguage: versions && versions.selectedLanguage,
			selectedVersion: version && version.id,
			languages,
			versions: versions
				&& versions.selectedLanguage
				&& versions.byLang[versions.selectedLanguage].versions,
			inputValue: version && version.local_abbreviation.toUpperCase(),
			langInputValue: null,
			languagelistSelectionIndex: 0,
			versionlistSelectionIndex: 0,
			cancelBlur: false,
			inputDisabled: false,
			dropdown: false,
			listErrorAlert: alert,
			versionFiltering: false,
			classes: 'hide-langs',
		}

		this.handleDropDownClick = ::this.handleDropDownClick
		this.handleLabelChange = ::this.handleLabelChange
		this.handleLabelKeyDown = ::this.handleLabelKeyDown
		this.handleLanguageFilter = ::this.handleLanguageFilter
		this.onBlur = ::this.onBlur
		this.getLanguage = ::this.getLanguage
		this.toggleVersionPickerList = ::this.toggleVersionPickerList
		this.handleListHover = ::this.handleListHover
	}

	componentDidMount() {
		const { languages, versions } = this.props
		// build languages and versions index client side when the component renders
		Filter.build('LanguageStore', [ 'name', 'local_name' ])
		Filter.build('VersionStore', [ 'title', 'local_title', 'local_abbreviation' ])
		if (languages) {
			Filter.add('LanguageStore', languages)
		}
		if (versions && versions.selectedLanguage) {
			// versions.byLang["lang_tag"] is an object, so we need to pass as array for filter
			const versionsObj = versions.byLang[versions.selectedLanguage].versions
			Filter.add('VersionStore', Object.keys(versionsObj).map(key => { return versionsObj[key] }))
		}
	}

	componentWillReceiveProps(nextProps) {
		const { versions, languages } = this.state
		// if languages and versions weren't available when componentDidMount
		// then let's handle adding the filter
		if (languages !== nextProps.languages) {
			Filter.add('LanguageStore', nextProps.languages)
		}
		if (versions !== nextProps.versions && nextProps.versions.selectedLanguage) {
			// versions.byLang["lang_tag"] is an object, so we need to pass as array for filter
			const versionsObj = nextProps.versions.byLang[nextProps.versions.selectedLanguage].versions
			Filter.add('VersionStore', Object.keys(versionsObj).map(key => { return versionsObj[key] }))
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { alert, versions, version } = this.props
		const {
			dropdown,
			listErrorAlert,
			versionFiltering,
			classes,
		} = this.state


		// keep the dropdown open to display error
		if (alert !== prevProps.alert) {
			if (alert) {
				this.setState({ listErrorAlert: true, dropdown: true })
			} else {
				this.setState({ listErrorAlert: false, dropdown: false })
			}
		}

		// only disable the input when modal is open and not filtering
		if (dropdown !== prevState.dropdown) {
			if (dropdown && !versionFiltering) {
				this.setState({ inputDisabled: true })
			} else if (!dropdown) {
				this.setState({
					inputDisabled: false,
					langInputValue: null,
					inputValue: version && version.local_abbreviation.toUpperCase(),
				})
				// always reset to show versions when the modal is closing
				if (classes === 'hide-versions') {
					this.toggleVersionPickerList()
				}
			}

		}

		// if the new version call is successful, let's close the modal
		if (version
			&& (
				!prevProps.version
				|| version.id !== prevProps.version.id
			)
			&& !alert
			&& !listErrorAlert
		) {
			// force the input to lose focus after successful load
			if (document.activeElement !== document.body) document.activeElement.blur();

			this.setState({
				dropdown: false,
				selectedVersion: version.id,
				inputValue: version.local_abbreviation.toUpperCase(),
				selectedLanguage: version.language.language_tag,
			})
		}

		// if we've changed languages, let's update the versions list
		if (versions
			&& (
				!prevProps.versions
				|| versions.selectedLanguage !== prevProps.versions.selectedLanguage
			)
		) {
			this.setState({
				versions: versions.byLang[versions.selectedLanguage].versions,
				selectedLanguage: versions.selectedLanguage,
			})
		}
	}

	/**
	 * handles clicking out of the VersionPicker label/input
	 *
	 * if the blur target is a book or version, we need to do the right thing and get
	 * what was clicked, otherwise we're going to close the modal and reset the state of
	 * the dropdown items
	 */
	onBlur() {
		const { languages, version, versions } = this.props
		const dat = this

		// when we click out of the input, we need to wait and check if either
		// the dropdown or a lang/version has been clicked
		// otherwise let's close and reset
		setTimeout(() => {

			// cancel blur is only true when dropdown or book/version is clicked
			if (dat.state.cancelBlur) {
				dat.setState({ cancelBlur: false })
			} else {
				dat.setState({
					dropdown: false,
					inputValue: version.local_abbreviation.toUpperCase()
				})

				const dis = dat
				setTimeout(() => {
					// delay the restoration of the full modal so the closing transition
					// doesn't look weird
					dis.setState({
						languages,
						versions: versions.byLang[dis.state.selectedLanguage].versions,
						listErrorAlert: false
					})
				}, 700)
			}

		}, 300)
	}

	/**
	 * Sets up state for the selected language
	 *
	 * @param      {<Object>}  selectedLanguage  	The selected language
	 */
	getLanguage(selectedLanguage) {
		const { getVersions } = this.props

		if (selectedLanguage.language_tag) {
			getVersions(selectedLanguage.language_tag)
			this.setState({
				selectedLanguage: selectedLanguage.language_tag,
				dropdown: true,
				languagelistSelectionIndex: 0,
				languageFiltering: false,
				listErrorAlert: false
			})
			this.toggleVersionPickerList()
		} else {
			this.setState({ listErrorAlert: true })
		}
	}

	// this handles the class toggling for book and version clicks on mobile
	toggleVersionPickerList() {
		const { classes } = this.state
		if (classes === 'hide-versions') {
			this.setState({ classes: 'hide-langs' })
		} else {
			this.setState({ classes: 'hide-versions' })
		}
	}


	handleLabelChange(inputValue) {
		// filter the versions given the input change
		const results = Filter.filter('VersionStore', inputValue.trim())
		this.setState({ inputValue, listErrorAlert: false })

		if (results.length > 0) {
			this.setState({
				versions: arrayToObject(results, 'id'),
				dropdown: true,
				versionlistSelectionIndex: 0,
				versionFiltering: true
			})
		}
	}

	handleLanguageFilter(changeEvent) {
		const inputValue = changeEvent.target.value
		// filter the versions given the input change
		const results = Filter.filter('LanguageStore', inputValue.trim())

		this.setState({ langInputValue: inputValue, listErrorAlert: false })

		if (results.length > 0) {
			this.setState({
				languages: results,
				dropdown: true,
				languagelistSelectionIndex: 0,
				languageFiltering: true
			})
		}
	}

	/**
	 * This is called when the dropdown arrow is clicked to render the version and language
	 * picker modal
	 */
	handleDropDownClick() {
		const { languages, versions, cancelDropDown } = this.props

		if (!cancelDropDown) {
			// don't close the dropdown modal when losing focus of the input,
			// because we're clicking the dropdown (not some other random place)
			this.setState({ cancelBlur: true, versionFiltering: false })

			// if the user is closing the dropdown and hasn't selected anything, let's
			// fill the input back up with the correct reference
			if (this.state.dropdown) {
				this.setState({
					dropdown: false
				})
			// we're opening the dropdown so let's disable the input field
			} else {
				this.setState({
					dropdown: true,
					languages,
					versions: versions.byLang[versions.selectedLanguage].versions
				})
			}
		}
	}

	/**
	 * this handles changing the selection index on hover of the list in context
	 *
	 * @param      {string}  context  The list that we're changing the index on
	 * @param      {number}  index    The index of the book or version being hovered over
	 */
	handleListHover(context, index) {
		if (context === 'versions') {
			this.setState({ versionlistSelectionIndex: index })
		}
	}


	/**
	 * this handles pressing certain keys in the VersionPicker label
	 *
	 * @param      {object}  event         KeyDown event
	 * @param      {string}  keyEventName  Name of key event used for all except space bar
	 * @param      {number}  keyEventCode  Code value of key event
	 */
	handleLabelKeyDown(event, keyEventName) {
		const {
			selectedChapter,
			dispatch,
			localizedLink,
			linkBuilder,
			onClick,
		} = this.props

		const {
			versionlistSelectionIndex,
			versionFiltering,
			versions,
		} = this.state

		const versionKeys = typeof versions === 'object' ? Object.keys(versions) : []
		// filtering
		if (versionFiltering && versionKeys.length > 0) {

			this.setState({ languagelistSelectionIndex: 0 })

			if (keyEventName === 'ArrowUp') {
				event.preventDefault()

				if (versionlistSelectionIndex > 0) {
					this.setState({ versionlistSelectionIndex: versionlistSelectionIndex - 1 })
				} else {
					this.setState({ versionlistSelectionIndex: versionKeys.length - 1 })
				}
			}

			if (keyEventName === 'ArrowDown') {
				event.preventDefault()

				if (versionlistSelectionIndex < versionKeys.length - 1) {
					this.setState({ versionlistSelectionIndex: versionlistSelectionIndex + 1 })
				} else {
					this.setState({ versionlistSelectionIndex: 0 })
				}
			}

			if (keyEventName === 'Enter') {
				event.preventDefault()
				if (onClick) {
					onClick({ id: versions[versionKeys[versionlistSelectionIndex]].id })
				} else {
					const chapURL = localizedLink(linkBuilder(versions[versionKeys[versionlistSelectionIndex]].id, selectedChapter.toLowerCase(), versions[versionKeys[versionlistSelectionIndex]].local_abbreviation.toLowerCase()))
					dispatch(push(chapURL))
				}
			}

		}

	}

	openDropdown = () => {
		this.setState({
			dropdown: true,
		})
	}

	handleCloseDropdown = () => {
		this.setState({
			dropdown: false,
		})
	}

	cancelBlur = () => {
		this.setState({
			cancelBlur: true,
		})
	}

	render() {
		const {
			intl,
			selectedChapter,
			languageMap,
			recentVersions,
			onClick,
			extraClassNames,
			linkBuilder,
			localizedLink
		} = this.props

		const {
			languages,
			versions,
			dropdown,
			inputValue,
			classes,
			selectedLanguage,
			selectedVersion,
			versionlistSelectionIndex,
			listErrorAlert,
			inputDisabled,
			versionFiltering,
			langInputValue
		} = this.state

		return (
			<div className={`version-picker-container ${extraClassNames || ''}`} >
				<Label
					input={inputValue}
					onClick={this.handleDropDownClick}
					onChange={this.handleLabelChange}
					onKeyDown={this.handleLabelKeyDown}
					dropdown={dropdown}
					filtering={versionFiltering}
					handleBlur={this.onBlur}
					disabled={inputDisabled}
				/>
				<DropdownTransition show={dropdown} exemptSelector={`.version-picker-container${extraClassNames ? `.${extraClassNames.split(' ').join('.')}` : ''} .dropdown-arrow-container`} onOutsideClick={this.handleCloseDropdown}>
					<div handleClick={this.cancelBlur}>
						<VersionPickerModal
							{...this.props}
							classes={classes}
							languageList={languages}
							versionList={versions}
							versionsMap={(this.props.versions.byLang
								&& selectedLanguage in this.props.versions.byLang)
								? this.props.versions.byLang[selectedLanguage].map
								: []
							}
							recentVersions={recentVersions}
							selectedLanguage={selectedLanguage}
							selectedVersion={selectedVersion}
							usfm={selectedChapter}
							getLanguage={this.getLanguage}
							onChange={this.handleLanguageFilter}
							onKeyDown={this.handleLangKeyDown}
							toggle={this.toggleVersionPickerList}
							versionlistSelectionIndex={versionlistSelectionIndex}
							onMouseOver={this.handleListHover}
							alert={listErrorAlert}
							versionsLanguageName={this.props.languages
								&& selectedLanguage
								&& languageMap
								&& languageMap[selectedLanguage]
								&& this.props.languages[languageMap[selectedLanguage]]
								&& this.props.languages[languageMap[selectedLanguage]].name
							}
							versionFiltering={versionFiltering}
							intl={intl}
							cancel={this.handleCloseDropdown}
							inputValue={langInputValue}
							onClick={onClick}
							linkBuilder={linkBuilder}
							localizedLink={localizedLink}
						/>
					</div>
				</DropdownTransition>
			</div>
		)
	}
}


/**
 *	@languages: 					array of languages
 *	@languageMap: 				object relating language_tag to array index
 *	@version: 						currently rendered version object
 *	@versions:    				list of versions for version.selectedLanguage
 *	@selectedChapter: 		rendered chapter
 */
VersionPicker.propTypes = {
	alert: PropTypes.any,
	languages: PropTypes.array,
	languageMap: PropTypes.object,
	version: PropTypes.object,
	versions: PropTypes.object,
	recentVersions: PropTypes.object,
	selectedChapter: PropTypes.string,
	getVersions: PropTypes.func,
	dispatch: PropTypes.func,
	cancelDropDown: PropTypes.bool,
	intl: PropTypes.object,
	onClick: PropTypes.func,
	extraClassNames: PropTypes.string,
	localizedLink: PropTypes.func,
	linkBuilder: PropTypes.func
}

VersionPicker.defaultProps = {
	alert: null,
	languages: [],
	languageMap: {},
	version: null,
	versions: { byLang: {} },
	recentVersions: [],
	selectedChapter: null,
	getVersions: null,
	chapter: null,
	dispatch: null,
	cancelDropDown: null,
	intl: null,
	onClick: null,
	extraClassNames: null,
	localizedLink: null,
	linkBuilder: (version, usfm, abbr) => {
		return `/bible/${version}/${usfm}.${abbr}`
	}
}

export default injectIntl(VersionPicker)
