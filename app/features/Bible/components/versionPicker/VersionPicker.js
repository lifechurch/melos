import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import Filter from '../../../../lib/filter'
import scrollList from '../../../../lib/scrollToView'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cookie from 'react-cookie';
import VersionPickerModal from './VersionPickerModal'
import Label from '../chapterPicker/Label'
import arrayToObject from '../../../../lib/arrayToObject'
import DropdownTransition from '../../../../components/DropdownTransition'


class VersionPicker extends Component {

	constructor(props) {
		super(props)
		const { version, languages, languageMap, versions, alert } = props

		this.state = {
			selectedLanguage: versions.selectedLanguage,
			selectedVersion: version.id,
			languages: languages,
			versions: versions.byLang[versions.selectedLanguage],
			inputValue: version.local_abbreviation.toUpperCase(),
			langInputValue: null,
			languagelistSelectionIndex: 0,
			versionlistSelectionIndex: 0,
			cancelBlur: false,
			inputDisabled: alert ? true : false,
			dropdown: alert ? true : false,
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
		this.getVersion = ::this.getVersion
		this.toggleVersionPickerList = ::this.toggleVersionPickerList
		this.handleListHover = ::this.handleListHover
	}

	componentDidMount() {
		const { languages, versions, alert } = this.props
		// build languages and versions index client side when the component renders
		Filter.build("LanguageStore", [ "name", "local_name" ])
		Filter.add("LanguageStore", languages)
		Filter.build("VersionStore", [ "title", "local_title", "local_abbreviation" ])
		// versions.byLang["lang_tag"] is an object, so we need to pass as array for filter
		let versionsObj = versions.byLang[versions.selectedLanguage]
		Filter.add("VersionStore", Object.keys(versionsObj).map(key => versionsObj[key]))
	}

	componentDidUpdate(prevProps, prevState) {
		const { alert, versions, version, chapter } = this.props
		const {
			versionlistSelectionIndex,
			languagelistSelectionIndex,
			dropdown,
			languages,
			listErrorAlert,
			versionFiltering,
			selectedVersion
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
					inputValue: version.local_abbreviation.toUpperCase(),
				})
			}

		}

		// if the new version call is successful, let's close the modal
		if (version.id !== prevProps.version.id && !alert && !listErrorAlert) {
			// force the input to lose focus after successful load
			if (document.activeElement != document.body) document.activeElement.blur();
			this.setState({ dropdown: false })
		}

		// if we've changed languages, let's update the versions list
		if ((versions.selectedLanguage !== prevProps.versions.selectedLanguage) ) {
			this.setState({ versions: versions.byLang[versions.selectedLanguage] })
		}
	}

	/**
	 * Sets up state for the selected language
	 *
	 * @param      {<Object>}  selectedLanguage  	The selected language
	 */
	getLanguage(selectedLanguage) {
		const { languages, languageMap, dispatch, versions, getVersions } = this.props

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

	getVersion(version) {
		const { selectedChapter, dispatch, getVersion } = this.props

		if (version.id) {
			this.setState({
				selectedVersion: version.id,
				inputValue: version.local_abbreviation.toUpperCase(),
			})
			getVersion(version.id)
		} else {
			this.setState({ listErrorAlert: true })
		}
	}

	// this handles the class toggling for book and version clicks on mobile
	toggleVersionPickerList() {
		const { classes } = this.state
		classes == 'hide-versions' ? this.setState({ classes: 'hide-langs' }) : this.setState({ classes: 'hide-versions' })
	}


	handleLabelChange(inputValue) {
		const { languages, languageMap } = this.props
		const { selectedLanguage } = this.state
		// filter the versions given the input change
		let results = Filter.filter("VersionStore", inputValue.trim())
		this.setState({ inputValue: inputValue, listErrorAlert: false })

		if (results.length > 0) {
			this.setState({
				versions: arrayToObject(results, 'id'),
				dropdown: true,
				versionlistSelectionIndex: 0,
				versionFiltering: true
			})
			this.toggleVersionPickerList()
		}
	}

	handleLanguageFilter(changeEvent) {
		const { languages, languageMap } = this.props
		const { selectedLanguage } = this.state

		let inputValue = changeEvent.target.value
		// filter the versions given the input change
		let results = Filter.filter("LanguageStore", inputValue.trim())

		this.setState({ langInputValue: inputValue, listErrorAlert: false })

		if (results.length > 0) {
			this.setState({
				languages: results,
				dropdown: true,
				languagelistSelectionIndex: 0,
				languageFiltering: true
			})
			this.toggleVersionPickerList()
		}
	}

	/**
	 * This is called when the dropdown arrow is clicked to render the version and language
	 * picker modal
	 */
	handleDropDownClick() {
		const { languages, version, languageMap, versions, cancelDropDown } = this.props

		if (!cancelDropDown) {
			// don't close the dropdown modal when losing focus of the input,
			// because we're clicking the dropdown (not some other random place)
			this.setState({ cancelBlur: true, versionFiltering: false })

			// if the full modal is being rendered, let's toggle the dropdown rendering
			if (!this.state.versionFiltering) {
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
						languages: languages,
						versions: versions.byLang[versions.selectedLanguage]
					})
				}
			// not full modal
			// this will be fired only when a user has been filtering and then clicks on the dropwdown
			} else {
				this.setState({
					dropdown: true,
					versions: versions.byLang[versions.selectedLanguage]
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
		if (context == "versions") {
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
	handleLabelKeyDown(event, keyEventName, keyEventCode) {
		const { languages, languageMap } = this.props
		const {
			inputValue,
			languagelistSelectionIndex,
			versionlistSelectionIndex,
			selectedLanguage,
			versionFiltering,
			versions
		} = this.state

		let versionKeys = typeof versions == 'object' ? Object.keys(versions) : []
		// filtering
		if (versionFiltering && versionKeys.length > 0) {

			this.setState({ languagelistSelectionIndex: 0 })
			if (keyEventName == "ArrowUp") {
				event.preventDefault()

				if (versionlistSelectionIndex > 0 ) {
					this.setState({ versionlistSelectionIndex: versionlistSelectionIndex - 1 })
				} else {
					this.setState({ versionlistSelectionIndex: versionKeys.length - 1 })
				}
			}
			if (keyEventName == "ArrowDown") {
				event.preventDefault()

				if (versionlistSelectionIndex < versionKeys.length - 1) {
					this.setState({ versionlistSelectionIndex: versionlistSelectionIndex + 1 })
				} else {
					this.setState({ versionlistSelectionIndex: 0 })
				}
			}
			if (keyEventName == "Enter") {
				event.preventDefault()
				//
				this.getVersion(versions[versionKeys[versionlistSelectionIndex]])
			}

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
		let dat = this

		// when we click out of the input, we need to wait and check if either
		// the dropdown or a lang/version has been clicked
		// otherwise let's close and reset
		setTimeout(function() {

			// cancel blur is only true when dropdown or book/version is clicked
			if (dat.state.cancelBlur) {
				dat.setState({ cancelBlur: false })
			} else {
				dat.setState({
					dropdown: false,
					inputValue: version.local_abbreviation.toUpperCase()
				})

				let dis = dat
				setTimeout(function() {
					// delay the restoration of the full modal so the closing transition
					// doesn't look weird
					dis.setState({
						languages: languages,
						versions: versions.byLang[dis.selectedLanguage],
						listErrorAlert: false
					})
				}, 700)
			}

		}, 300)
	}

	closeDropdown = () => {
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
		const { version, intl, languageMap } = this.props
		const {
			languages,
			versions,
			dropdown,
			inputValue,
			classes,
			selectedLanguage,
			selectedVersion,
			selectedChapter,
			languagelistSelectionIndex,
			versionlistSelectionIndex,
			listErrorAlert,
			inputDisabled,
			versionFiltering,
			langInputValue
		} = this.state

		return (
			<div className={`version-picker-container`} >
				<Label
					input={inputValue}
					onClick={this.handleDropDownClick}
					onChange={this.handleLabelChange}
					onKeyDown={this.handleLabelKeyDown}
					dropdown={dropdown}
					filtering={versionFiltering}
					onBlur={this.onBlur}
					disabled={inputDisabled}
				/>
				<DropdownTransition show={dropdown} exemptSelector='.version-picker-container > .dropdown-arrow-container' onOutsideClick={this.closeDropdown}>
					<div onClick={this.cancelBlur}>
						<VersionPickerModal
							classes={classes}
							languageList={languages}
							versionList={versions}
							selectedLanguage={selectedLanguage}
							selectedVersion={selectedVersion}
							getVersion={this.getVersion}
							getLanguage={this.getLanguage}
							handleChange={this.handleLanguageFilter}
							handleKeyDown={this.handleLangKeyDown}
							toggle={this.toggleVersionPickerList}
							versionlistSelectionIndex={versionlistSelectionIndex}
							onMouseOver={this.handleListHover}
							alert={listErrorAlert}
							versionsLanguageName={this.props.languages[languageMap[selectedLanguage]].name}
							versionFiltering={versionFiltering}
							intl={intl}
							cancel={this.closeDropdown}
							inputValue={langInputValue}
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
 *	@getVersion:
 */
VersionPicker.propTypes = {
	languages: React.PropTypes.array,
	languageMap: React.PropTypes.object,
	version: React.PropTypes.object,
	versions: React.PropTypes.object,
	selectedChapter: React.PropTypes.string,
	getVersion: React.PropTypes.func,
	getVersions: React.PropTypes.func
}

export default VersionPicker