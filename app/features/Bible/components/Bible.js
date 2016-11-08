import React, { Component, PropTypes } from 'react'
import Audio from './audio/Audio'
import Header from './header/Header'
import Settings from './settings/Settings'
import VerseAction from './verseAction/VerseAction'
import { connect } from 'react-redux'
import ActionCreators from '../actions/creators'
import Filter from '../../../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Books from './chapterPicker/Books'
import Chapters from './chapterPicker/Chapters'
import Languages from './versionPicker/Languages'
import Versions from './versionPicker/Versions'
import cookie from 'react-cookie';
import moment from 'moment'
import Label from './chapterPicker/Label'
import LabelPill from './verseAction/bookmark/LabelPill'
import ColorList from './verseAction/ColorList'
import Chapter from './content/Chapter'
import ChapterPicker from './chapterPicker/ChapterPicker'
import VersionPicker from './versionPicker/VersionPicker'
import LabelList from './verseAction/bookmark/LabelList'
import LocalStore from '../../../lib/localStore'
import RecentVersions from '../lib/RecentVersions'
import FontSettingsTriggerImage from './settings/FontSettingsTriggerImage'
import TriggerButton from '../../../components/TriggerButton'
import ButtonBar from '../../../components/ButtonBar'
import Toggle from '../../../components/Toggle'
import LabelSelector from './verseAction/bookmark/LabelSelector'

class Bible extends Component {

	constructor(props) {
		super(props)
		const { bible } = props

		// if we get a bad chapter call, let's grab the first valid book and chapter
		// for the selected version
		if (!bible.chapter.reference) {
			let chap = bible.books.all[0].chapters[Object.keys(bible.books.all[0].chapters)[0]]
			this.chapterError = true
			this.selectedBook = bible.books.all[0].usfm
			this.selectedChapter = chap.usfm
			this.selectedVersion = bible.version.id
			this.inputValue = `${bible.books.all[0].human} ${chap.human}`
			this.chapters = bible.books.all[0].chapters
		} else {
			this.chapterError = false
			this.selectedBook = bible.chapter.reference.usfm.split('.')[0]
			this.selectedChapter = bible.chapter.reference.usfm
			this.selectedVersion = bible.chapter.reference.version_id
			this.inputValue = bible.chapter.reference.human
			this.chapters = bible.books.all[bible.books.map[bible.chapter.reference.usfm.split('.')[0]]].chapters
		}


		this.state = {
			selectedBook: this.selectedBook,
			selectedChapter: this.selectedChapter,
			selectedVersion: this.selectedVersion,
			selectedLanguage: bible.versions.selectedLanguage,
			chapterError: this.chapterError,
			dbReady: false,
			chapDropDownCancel: false,
			versionDropDownCancel: false,
			db: null,
			results: [],
			versions: []
		}

		this.chapterPicker = null
		this.versionsss = null
		this.versionPicker = null
		this.color = null
		this.content = null
		this.labels = null

		LocalStore.setIn('mySettings.bob.john.fred', 'superman')
		console.log(LocalStore.getIn('mySettings.bob.john.fred'))

		LocalStore.setIn('mySettings.bob.john.fred', 'aquaman')
		console.log(LocalStore.getIn('mySettings.bob.john.fred'))

		LocalStore.deleteIn('mySettings.bob.john.fred')
		console.log(LocalStore.getIn('mySettings.bob.john.fred'))

		LocalStore.set('most-recent-version', 111)
		console.log(LocalStore.get('most-recent-version'))

		LocalStore.delete('most-recent-version')
		console.log(LocalStore.get('most-recent-version'))

		this.handleButtonBarClick = ::this.handleButtonBarClick
	}

	getVersions(languageTag) {
		const { dispatch } = this.props
		const comp = this
		this.setState({ selectedLanguage: languageTag })

		dispatch(ActionCreators.bibleVersions({ language_tag: languageTag, type: 'all' })).then((versions) => {
			console.time("Build Versions Index")
			Filter.build("VersionStore", [ "title", "local_title", "abbreviation" ])
			console.timeEnd("Build Versions Index")

			console.time("Add V Items")
			Filter.add("VersionStore", versions.versions)
			console.timeEnd("Add V Items")
		})

		dispatch(ActionCreators.bibleConfiguration()).then((config) => {
			console.time("Build Index")
			Filter.build("LangStore", [ "name", "local_name" ])
			console.timeEnd("Build Index")

			console.time("Add Items")
			Filter.add("LangStore", config.default_versions)
			console.timeEnd("Add Items")
		})

		dispatch(ActionCreators.loadVersionAndChapter({ id: 100, reference: this.state.selectedChapter }))
	}

	getVC(versionID) {
		const { dispatch, bible } = this.props
		this.setState({ selectedVersion: versionID })
		dispatch(ActionCreators.loadVersionAndChapter({ id: versionID, reference: this.state.selectedChapter }))
	}

	getBook(book) {
		this.setState({ selectedBook: book.usfm })
		this.toggleChapterPickerList()
	}

	getChapter(chapterusfm) {
		const { dispatch, bible } = this.props
		this.setState({ selectedChapter: chapterusfm })
		this.chapterVersionCall(this.state.selectedVersion, chapterusfm)
		this.toggleChapterPickerList()

		// then write cookie for selected chapter
		LocalStore.set('last_read', chapterusfm)
	}

	getVersion(versionid) {
		const { dispatch, bible } = this.props
		this.chapterVersionCall(versionid, this.state.selectedChapter)
		this.setState({ selectedVersion: versionid })
		this.toggleVersionPickerList()

		this.recentVersions.add(versionid)

		// then write cookie for selected version
		LocalStore.set('version', versionid)
	}

	chapterVersionCall(versionid, reference) {
		const { dispatch } = this.props
		dispatch(ActionCreators.bibleChapter({ id: versionid, reference: reference}))
		if (versionid !== this.state.selectedVersion) {
			this.setState({ selectedVersion: versionid })
			dispatch(ActionCreators.bibleVersion({ id: versionid })).then((version) => {
				this.recentVersions.addVersion(version)
			})
		}
	}


	getLanguage(language) {

	}

	handleLabelChange(inputValue) {
		// const { books, bookMap } = this.props
		// const { selectedBook } = this.state

		// filter the books given the input change
		// let results = Filter.filter("BooksStore", inputValue.trim())

		this.setState({ inputValue: inputValue })

	}

	getLabels() {
		const { dispatch } = this.props
		dispatch(ActionCreators.momentsLabels(true, { selectedLanguage: this.state.selectedLanguage }))
	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		(this.state.classes) == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
	}

	toggleVersionPickerList() {
		(this.state.classes) == 'hide-langs' ? this.setState({ classes: 'hide-versions' }) : this.setState({ classes: 'hide-langs' })
	}

	togglePickerExclusion(context) {
		// each picker calls to tell which context is now open
		if (context == 'chapter') {
			this.setState({ versionDropDownCancel: true, chapDropDownCancel: false })
		} else if (context == 'version') {
			this.setState({ versionDropDownCancel: false, chapDropDownCancel: true })
		} else if (context == 'none') {
			this.setState({ versionDropDownCancel: false, chapDropDownCancel: false })
		}
	}


	filterLang(changeEvent) {
		const filter = changeEvent.target.value;
		const instance = this
		console.time("Filter Items")
		const results = Filter.filter("LangStore", filter)
		console.timeEnd("Filter Items")
		instance.setState({ results })
	}

	filterVersions(changeEvent) {
		const filter = changeEvent.target.value;
		const instance = this
		console.time("Filter V Items")
		const versions = Filter.filter("VersionStore", filter)
		console.timeEnd("Filter V Items")
		instance.setState({ versions })
	}

	labelSelect(label) {
		console.log('select', label)
	}

	labelDelete(label) {
		console.log('delete', label)
	}

	getColor(color) {
		console.log(color)
	}

	handleVerseSelect(e) {
		console.log(e)
	}

	getColors() {
		const { dispatch } = this.props
		dispatch(ActionCreators.momentsColors())
	}

	componentDidUpdate(prevProps, prevState) {
		const { bible } = this.props
		const { chapter } = this.state

		if (bible.chapter != prevProps.bible.chapter) {
			if (bible.chapter.errors) {
				this.setState({ chapterError: true })
			} else {
				this.setState({ chapterError: false })
			}
		}

	}

	handleTriggerClick() {
		console.log("Ouch!")
	}

	componentDidMount() {
		const { dispatch, bible, auth } = this.props

		this.recentVersions = new RecentVersions()

		this.recentVersions.onUpdate((settings) => {
			dispatch(ActionCreators.usersUpdateSettings(auth.isLoggedIn, settings))
		})

		this.recentVersions.syncVersions(bible.settings)

		console.log("Recent Versions:", this.recentVersions.get())
	}

	handleButtonBarClick(item) {
		console.log("BBC", item)
	}

	render() {
		const { bible, audio, settings, verseAction } = this.props
		const { results, versions } = this.state

		const triggerImage = (<FontSettingsTriggerImage />)
		const trigger = (<TriggerButton image={triggerImage} onClick={::this.handleTriggerClick} />)
		const buttons = [
			{ label: 'Arial', value: 's' },
			{ label: 'Tisa Pro', value: 'm' },
			{ label: 'Avenir', value: 'l' },
			{ label: 'Courier New', value: 'z' },
			{ label: (<LabelPill label='Righteous' canDelete={false} onDelete={::this.labelDelete} onSelect={::this.labelSelect} count={26} active={false} />), value: 's1' },
			{ label: 'Facebook', value: 'm1' },
			{ label: 'San Fran', value: 'l1' },
			{ label: 'Proxima Nova', value: 'z1' },
			{ label: (<Color color={'a3b2c1'} onSelect={::this.getColor} />), value: 's2' },
			{ label: 'Guatemala', value: 'm2' },
			{ label: 'Costa Rica', value: 'l2' },
			{ label: 'Neverland', value: 'z2' }
		]

		if (Array.isArray(bible.books.all) && bible.books.map && bible.chapter) {
			this.chapterPicker = (
				<ChapterPicker
					{...this.props}
					chapter={bible.chapter}
					books={bible.books.all}
					bookMap={bible.books.map}
					selectedLanguage={this.state.selectedLanguage}
					getChapter={::this.getChapter}
					initialBook={this.state.selectedBook}
					initialChapter={this.state.selectedChapter}
					initialInput={this.inputValue}
					initialChapters={this.chapters}
					cancelDropDown={this.state.chapDropDownCancel}
					togglePickerExclusion={::this.togglePickerExclusion}
				/>
			)
		}

		if (Array.isArray(bible.languages.all) && bible.languages.map && bible.version.abbreviation ) {
			this.versionPicker = (
				<VersionPicker
					{...this.props}
					version={bible.version}
					languages={bible.languages.all}
					versions={bible.versions}
					languageMap={bible.languages.map}
					selectedChapter={bible.chapter.reference ? bible.chapter.reference.usfm : this.state.selectedChapter}
					alert={this.state.chapterError}
					getVersion={::this.getVersion}
					getVersions={::this.getVersions}
					cancelDropDown={this.state.versionDropDownCancel}
					togglePickerExclusion={::this.togglePickerExclusion}
				/>
			)
		}

		if (Array.isArray(bible.highlightColors)) {
			this.color = <ColorList list={bible.highlightColors} />
		}

		if (this.state.chapterError) {
			this.content = <h2>Oh nooooooooo</h2>
		} else if (bible.chapter && bible.chapter.reference && bible.version && bible.version.language && bible.chapter.content) {
			this.content = (
				<Chapter
					chapter={bible.chapter}
					fontSize="20"
					fontFamily="Arial"
					onSelect={::this.handleVerseSelect}
					textDirection={bible.version.language.text_direction}
					showFootnotes={true}
					showTitles={true}
					showVerseNumbers={true}
				/>
			)
		}

		if (bible.momentsLabels && bible.momentsLabels.byCount && bible.momentsLabels.byAlphabetical) {
			this.labels = (
				<div>
					<LabelSelector
						byAlphabetical={bible.momentsLabels.byAlphabetical}
						byCount={bible.momentsLabels.byCount}
					/>
				</div>
			)
		}

		return (
			<div className="">
				<ButtonBar items={buttons} cols={1} onClick={this.handleButtonBarClick} /><br/>
				<ButtonBar items={buttons} cols={2} onClick={this.handleButtonBarClick} /><br/>
				<ButtonBar items={buttons} cols={3} onClick={this.handleButtonBarClick} /><br/>
				<ButtonBar items={buttons} cols={4} onClick={this.handleButtonBarClick} />
				<Toggle label="Give Me More!" value={true} />
				<div className="row">
					<div className='row'>
						<div className="columns medium-12 vertical-center">
							{ trigger }
							{ this.chapterPicker }
							{ this.versionPicker }
						</div>
					</div>
				</div>
				<div className="row">
					<div className="columns large-6 medium-10 medium-centered">
						{ this.content }
					</div>
				</div>
				<div>
					<div onClick={::this.getLabels} >Get Labels Bruh</div>
					<div>{ this.labels }</div>
					<div className="row">
					<Header {...this.props} />
					<Audio audio={audio} />
					<Settings settings={settings} />
					<VerseAction verseAction={verseAction} />
						<div className="columns medium-3">
							<div onClick={::this.getColors}>Get Colors</div>
							{ this.color }
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Bible.propTypes = {
	bible: PropTypes.object.isRequired
}

export default Bible