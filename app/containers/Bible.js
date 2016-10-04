import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'
import Filter from '../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Books from '../features/Bible/components/chapterPicker/Books'
import Chapters from '../features/Bible/components/chapterPicker/Chapters'
import Languages from '../features/Bible/components/versionPicker/Languages'
import Versions from '../features/Bible/components/versionPicker/Versions'
import cookie from 'react-cookie';
import moment from 'moment'
import ChapterPicker from '../features/Bible/components/chapterPicker/ChapterPicker'
import LabelPill from '../features/Bible/components/verseAction/bookmark/LabelPill'
import Color from '../features/Bible/components/verseAction/Color'


class BibleView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedBook: cookie.load('last_read') ? cookie.load('last_read').split('.')[0] : 'MAT',
			selectedChapter: cookie.load('last_read') || 'MAT.1',
			classes: 'hide-chaps',
			selectedVersion: cookie.load('version') || 111,
			selectedLanguage: 'eng',
			dbReady: false,
			db: null,
			results: [],
			versions: []
		}
		// props.dispatch(ActionCreators.loadVersionAndChapter({ id: 100, reference: 'MAT.1' }))
		// props.dispatch(ActionCreators.momentsColors())
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
		dispatch(ActionCreators.momentsColors())
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

	getChapter(chapter) {
		const { dispatch, bible } = this.props
		this.setState({ selectedChapter: chapter.usfm })
		this.toggleChapterPickerList()
		dispatch(ActionCreators.bibleChapter({ id: this.state.selectedVersion, reference: chapter.usfm }))
		// then write cookie for selected chapter
		cookie.save('last_read', chapter.usfm, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		(this.state.classes) == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
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

	render() {
		const { bible } = this.props
		const { results, versions } = this.state

		let resultItems = results.map((r) => {
			return (<li key={r.language_tag}>{r.name} {r.local_name}</li>)
		})

		let versionItems = versions.map((v) => {
			return (<li key={v.id}>{v.abbreviation} {v.title}</li>)
		})

		var chapterPicker = null
		if (Array.isArray(bible.books.all) && bible.books.map) {
			chapterPicker = <ChapterPicker classes={this.state.classes} bookList={bible.books.all} chapterList={bible.books.all[bible.books.map[this.state.selectedBook]].chapters} selectedBook={this.state.selectedBook} selectedChapter={this.state.selectedChapter} getChapter={::this.getChapter} getBook={::this.getBook} toggle={::this.toggleChapterPickerList} />
		}

		var versionsss = null
		if (bible.versions.byLang && bible.versions.byLang[this.state.selectedLanguage]) {
			versionsss = <Versions list={bible.versions.byLang[this.state.selectedLanguage]} onSelect={::this.getVC} initialSelection={this.state.selectedVersion} header='English' />
		}

		var languages = null
		if (Array.isArray(bible.languages.all) && bible.languages.map) {
			languages = <Languages list={bible.languages.all} onSelect={::this.getVersions} initialSelection={this.state.selectedLanguage} header='All' />
		let color = null
		if (Array.isArray(bible.highlightColors)) {
			color = (
				<div>
					<Color color={bible.highlightColors[3]} onSelect={::this.getColor} />
					<Color color={bible.highlightColors[7]} onSelect={::this.getColor} />
					<Color color={bible.highlightColors[13]} onSelect={::this.getColor} />
				</div>

			)
		}

		return (
			<div>
				<div className="row">
					<div className="columns medium-12">
						<Bible bible={bible} />
					</div>
				</div>
				<div className=''>
					{ chapterPicker }
				</div>
				<div className="row">
					<div className="columns medium-3">
						<a onClick={this.getVersions.bind(this, this.state.selectedLanguage)}>Get Versions</a>
						<input onChange={::this.filterVersions} />
						<ul>
							<ReactCSSTransitionGroup transitionName='content' transitionEnterTimeout={250} transitionLeaveTimeout={250}>
							{versionItems}
							</ReactCSSTransitionGroup>
						</ul>
					</div>
					<div className="columns medium-3">
						<div dangerouslySetInnerHTML={{ __html: bible.chapter.content }} />
					</div>
					<div className="columns medium-3">
						<LabelPill label='Righteous' canDelete={false} onDelete={::this.labelDelete} onSelect={::this.labelSelect} count={26} active={false} />
						<LabelPill label='Holy' canDelete={false} onDelete={::this.labelDelete} onSelect={::this.labelSelect} count={6} active={true} />
						<LabelPill label='Peace' canDelete={true} onDelete={::this.labelDelete} onSelect={::this.labelSelect} count={1} active={false} />
						{ languages }
						{ versionsss }
						{ color }
					</div>
					<div className="columns medium-3">
						<input onChange={::this.filterLang} />
						<ul>
							{resultItems}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		bible: state.bibleReader
	}
}

export default connect(mapStateToProps, null)(BibleView)
