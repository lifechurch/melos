import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import Filter from '../../../../lib/filter'
import scrollList from '../../../../lib/scrollToView'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cookie from 'react-cookie';
import moment from 'moment'
import VersionPickerModal from './VersionPickerModal'
import Label from '../chapterPicker/Label'
import arrayToObject from '../../../../lib/arrayToObject'


class VersionPicker extends Component {

	constructor(props) {
		super(props)
		const { version, languages, languageMap, versions, alert } = props

		this.state = {
			selectedLanguage: versions.selectedLanguage,
			selectedVersion: version.id,
			languages: languages,
			versions: versions.byLang[versions.selectedLanguage],
			inputValue: version.abbreviation.toUpperCase(),
			langInputValue: null,
			languagelistSelectionIndex: 0,
			versionlistSelectionIndex: 0,
			cancelBlur: false,
			inputDisabled: false,
			dropdown: alert ? true : false,
			listErrorAlert: alert,
			versionFiltering: false,
			classes: 'hide-langs'
		}
	}

	componentDidMount() {
		const { languages, versions } = this.props
		// build languages and versions index client side when the component renders
		Filter.build("LanguageStore", [ "name", "local_name" ])
		Filter.add("LanguageStore", languages)
		Filter.build("VersionStore", [ "title", "local_title", "abbreviation" ])
		// versions.byLang["lang_tag"] is an object, so we need to pass as array for filter
		let versionsObj = versions.byLang[versions.selectedLanguage]
		Filter.add("VersionStore", Object.keys(versionsObj).map(key => versionsObj[key]))
	}

	/**
	 * on component update, we're going to scroll the active/focused elements into view if their
	 * index has changed
	 *
	 * @param  prevProps  				The previous properties
	 * @param  prevState  				The previous state
	 */
	componentDidUpdate(prevProps, prevState) {
		const { alert } = this.props
		const {
			versionlistSelectionIndex,
			languagelistSelectionIndex,
			dropdown,
			languages,
			versions,
			listErrorAlert
		} = this.state

		let focusElement = document.getElementsByClassName('focus')[0]
		let activeElements = document.getElementsByClassName('active')
		let containerElement = document.getElementsByClassName('modal')[0]
		let listElement = null

		// let's check if any selection index has changed, and then scroll to the correct
		// positions to make sure the selected elements are in view
		if (versionlistSelectionIndex !== prevState.versionlistSelectionIndex) {
			listElement = document.getElementsByClassName('version-list')[0]
			scrollList(focusElement, containerElement, listElement)
		}
		if (languagelistSelectionIndex !== prevState.languagelistSelectionIndex) {
			listElement = document.getElementsByClassName('language-list')[0]
			scrollList(focusElement, containerElement, listElement)
		}
		// scroll to the actively selected language and version on dropdown
		if ((dropdown !== prevState.dropdown) && languages && versions) {
			listElement = document.getElementsByClassName('language-list')[0]
			scrollList(activeElements[0], containerElement, listElement)
			listElement = document.getElementsByClassName('version-list')[0]
			scrollList(activeElements[1], containerElement, listElement)
		}

		// if (alert != prevProps.alert) {
		// 	this.setState({
		// 		listErrorAlert: alert
		// 	})
		// }

		if (!dropdown) {
			this.setState({
				versionFiltering: false
			})
		}

	}

	/**
	 * Sets up state for the selected language
	 *
	 * @param      {<Object>}  selectedLanguage  	The selected language
	 * @param      {<Bool>}    filtering     			are we filtering language list?
	 *                                       			this tells us whether to still render the language list
	 */
	getLanguage(selectedLanguage) {
		const { languages, languageMap, dispatch, version } = this.props

		if (selectedLanguage.language_tag) {
			dispatch(ActionCreators.bibleVersions({ language_tag: selectedLanguage.language_tag, type: 'all' })).then((versions) => {
				Filter.build("VersionStore", [ "title", "local_title", "abbreviation" ])
				Filter.add("VersionStore", versions.versions)
			}, (error) => {
				this.setState({ listErrorAlert: true })
			})

			this.setState({
				selectedLanguage: selectedLanguage.language_tag,
				versions: version.versions,
				dropdown: true,
				languagelistSelectionIndex: 0,
				listErrorAlert: false
			})
			this.toggleVersionPickerList()
		} else {
			this.setState({ listErrorAlert: true })
		}
	}

	getVersion(version) {
		const { selectedChapter, dispatch } = this.props

		if (version.id) {
			dispatch(ActionCreators.loadVersionAndChapter({ id: version.id, reference: selectedChapter}))
			this.setState({
				selectedVersion: version.id,
				listErrorAlert: false,
				dropdown: false,
				inputValue: version.abbreviation.toUpperCase()
			})
			this.toggleVersionPickerList()
			// then write cookie for selected version
			cookie.save('version', version.id, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
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
 		console.log(inputValue)
		// filter the versions given the input change
		let results = Filter.filter("VersionStore", inputValue.trim())
		console.log(results)
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

	handleLanguageFilter(inputValue) {
		const { languages, languageMap } = this.props
		const { selectedLanguage } = this.state

		// filter the versions given the input change
		let results = Filter.filter("LanguageStore", inputValue.trim())

		this.setState({ langInputValue: inputValue, listErrorAlert: false })

		if (results.length > 0) {
			this.setState({ languages: results, dropdown: true, languagelistSelectionIndex: 0 })
			this.toggleVersionPickerList()
		}
	}

	/**
	 * This is called when the dropdown arrow is clicked to render the book and version
	 * picker modal
	 */
	handleDropDownClick() {
		const { languages, version, languageMap, versions } = this.props
		// const { selectedLanguage } = this.state

		// don't close the dropdown modal when losing focus of the input,
		// because we're clicking the dropdown (not some other random place)
		this.setState({ cancelBlur: true })

		// if the full modal is being rendered, let's toggle the dropdown rendering
		if (!this.state.versionFiltering) {
			// if the user is closing the dropdown and hasn't selected anything, let's
			// fill the input back up with the correct reference
			if (this.state.dropdown) {
				this.setState({
					dropdown: false,
					inputValue: version.abbreviation.toUpperCase(),
					selectedLanguage: versions.selectedLanguage,
					selectedVersion: version.id,
					versions: versions.byLang[versions.selectedLanguage],
					inputDisabled: false,
					listErrorAlert: false
				})
			// we're opening the dropdown so let's disable the input field
			} else {
				this.setState({
					dropdown: true,
					inputDisabled: true,
					languages: languages,
					versions: versions.byLang[versions.selectedLanguage]
				})

			}
		// not full modal
		// this will be fired only when a user has been filtering and then clicks on the dropwdown
		} else {
			this.setState({
				dropdown: true,
				inputDisabled: true,
				versions: versions.byLang[versions.selectedLanguage],
				listErrorAlert: false,
				versionFiltering: false
			})
		}

	}

	/**
	 * this handles changing the selection index on hover of the list in context
	 *
	 * @param      {string}  context  The list that we're changing the index on
	 * @param      {number}  index    The index of the book or version being hovered over
	 */
	handleListHover(context, index) {
		if (context == "languages") {
			this.setState({ languagelistSelectionIndex: index })
		} else if (context == "versions") {
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
			selectedLanguage
		} = this.state


	// 	// filtering
	// 	if (true) {
	// 		this.setState({ versionlistSelectionIndex: 0 })

	// 		if (keyEventName == "ArrowUp") {
	// 			event.preventDefault()

	// 			if (languagelistSelectionIndex > 0 ) {
	// 				this.setState({ languagelistSelectionIndex: languagelistSelectionIndex - 1 })
	// 			} else {
	// 				this.setState({ languagelistSelectionIndex: this.state.languages.length - 1 })
	// 			}
	// 		}
	// 		if (keyEventName == "ArrowDown") {
	// 			event.preventDefault()

	// 			if (languagelistSelectionIndex < this.state.languages.length - 1) {
	// 				this.setState({ languagelistSelectionIndex: languagelistSelectionIndex + 1 })
	// 			} else {
	// 				this.setState({ languagelistSelectionIndex: 0 })
	// 			}
	// 		}
	// 		if (keyEventName == "Enter" || keyEventName == "ArrowRight") {
	// 			event.preventDefault()
	// 			//
	// 			this.getLanguage(this.state.languages[languagelistSelectionIndex], true)
	// 		}

	// }

	}

	handleLangKeyDown(event, keyEventName, keyEventCode) {
		const { languages, languageMap } = this.props
		const {
			inputValue,
			languagelistSelectionIndex,
			versionlistSelectionIndex,
			selectedLanguage
		} = this.state


	// 	// filtering
	// 	if (true) {
	// 		this.setState({ versionlistSelectionIndex: 0 })

	// 		if (keyEventName == "ArrowUp") {
	// 			event.preventDefault()

	// 			if (languagelistSelectionIndex > 0 ) {
	// 				this.setState({ languagelistSelectionIndex: languagelistSelectionIndex - 1 })
	// 			} else {
	// 				this.setState({ languagelistSelectionIndex: this.state.languages.length - 1 })
	// 			}
	// 		}
	// 		if (keyEventName == "ArrowDown") {
	// 			event.preventDefault()

	// 			if (languagelistSelectionIndex < this.state.languages.length - 1) {
	// 				this.setState({ languagelistSelectionIndex: languagelistSelectionIndex + 1 })
	// 			} else {
	// 				this.setState({ languagelistSelectionIndex: 0 })
	// 			}
	// 		}
	// 		if (keyEventName == "Enter" || keyEventName == "ArrowRight") {
	// 			event.preventDefault()
	// 			//
	// 			this.getLanguage(this.state.languages[languagelistSelectionIndex], true)
	// 		}

	// }

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
		// the dropdown or a book/version has been clicked
		// otherwise let's close and reset
		setTimeout(function() {

			// cancel blur is only true when dropdown or book/version is clicked
			if (dat.state.cancelBlur) {
				dat.setState({ cancelBlur: false })
			} else {
				dat.setState({
					dropdown: false,
					inputValue: version.abbreviation.toUpperCase()
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


	render() {
		const { version } = this.props
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
			versionFiltering
		} = this.state

		let hide = (dropdown) ? '' : 'hide-modal'

		return (
			<div className={`version-picker-container`} >
				<Label
					input={inputValue}
					onClick={::this.handleDropDownClick}
					onChange={::this.handleLabelChange}
					onKeyDown={::this.handleLabelKeyDown}
					dropdown={dropdown}
					onBlur={::this.onBlur}
					disabled={inputDisabled}
				/>
				<div className={`modal ${hide}`} onClick={() => this.setState({ cancelBlur: true })}>
					<VersionPickerModal
						classes={classes}
						languageList={languages}
						versionList={versions}
						selectedLanguage={selectedLanguage}
						selectedVersion={selectedVersion}
						getVersion={::this.getVersion}
						getLanguage={::this.getLanguage}
						handleChange={::this.handleLanguageFilter}
						handleKeyDown={::this.handleLangKeyDown}
						toggle={::this.toggleVersionPickerList}
						languagelistSelectionIndex={languagelistSelectionIndex}
						versionlistSelectionIndex={versionlistSelectionIndex}
						onMouseOver={::this.handleListHover}
						alert={listErrorAlert}
						versionsLanguageName='English'
						versionFiltering={versionFiltering}
					/>
				</div>
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
 *	@getChapter:  				promise of chapter call so this component can determine
 *												whether the chapter is available in the newly selected version
 */
VersionPicker.propTypes = {
	languages: React.PropTypes.array,
	languageMap: React.PropTypes.object,
	version: React.PropTypes.object,
	versions: React.PropTypes.object,
	selectedChapter: React.PropTypes.string,
	getChapter: React.PropTypes.func
}

export default VersionPicker