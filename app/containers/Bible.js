import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'
import Filter from '../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Books from '../features/Bible/components/chapterPicker/Books'
import Chapters from '../features/Bible/components/chapterPicker/Chapters'



class BibleView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedBook: 'MAT',
			selectedChapter: 'MAT.1'
			dbReady: false,
			db: null,
			results: [],
			versions: []
		}
		props.dispatch(ActionCreators.loadVersionAndChapter({ id: 100, reference: 'MAT.1' }))
		props.dispatch(ActionCreators.momentsColors())
	}

	getVersions() {
		const { dispatch } = this.props
		const comp = this

		dispatch(ActionCreators.bibleVersions({ language_tag: 'eng', type: 'all' })).then((versions) => {
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

	}

	getVC(version) {
		const { dispatch, bible } = this.props
		dispatch(ActionCreators.loadVersionAndChapter({ id: version.id, reference: this.state.selectedChapter }))
	}


// ********* BOOK | CHAPTER SELECTOR *********** //
	getBook(book) {
		this.setState({ selectedBook: book.usfm })
	}

	getChapter(chapter) {
		const { dispatch, bible } = this.props
		this.setState({ selectedChapter: chapter.usfm })
		dispatch(ActionCreators.bibleChapter({ id: bible.version.id, reference: chapter.usfm }))
	}
// ********************************************* //

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

	render() {
		const { bible } = this.props
		const { results, versions } = this.state

		let resultItems = results.map((r) => {
			return (<li key={r.language_tag}>{r.name} {r.local_name}</li>)
		})

		let versionItems = versions.map((v) => {
			return (<li key={v.id}>{v.abbreviation} {v.title}</li>)
		})

		var books = null
		if (Array.isArray(bible.books.all) && bible.books.map) {
			books = <Books list={bible.books.all} onSelect={::this.getBook} initialSelection={this.state.selectedBook} />
		}
		var chapters = null
		if (Array.isArray(bible.books.all) && bible.books.map) {
			chapters = <Chapters list={bible.books.all[bible.books.map[this.state.selectedBook]].chapters} onSelect={::this.getChapter} initialSelection={this.state.selectedChapter} />
		}

		return (
			<div>
				<div className="row">
					<div className="columns medium-12">
						<Bible bible={bible} />
					</div>
				</div>
				<div className="row">
					<div className="columns medium-3">
						<a onClick={::this.getVersions}>Get Versions</a>
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
						{ books }
						{ chapters }
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
