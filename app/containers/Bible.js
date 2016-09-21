import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'
import Filter from '../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class BibleView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			dbReady: false,
			db: null,
			results: [],
			versions: []
		}
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

		dispatch(ActionCreators.loadVersionAndChapter({ id: 100, reference: 'MAT.1' }))
		dispatch(ActionCreators.momentsColors())
	}

	getVC(version) {
		const { dispatch, bible } = this.props
		dispatch(ActionCreators.loadVersionAndChapter({ id: version.id, reference: bible.chapter.reference.usfm[0] }))
	}

	getBook(book) {
		const { dispatch, bible } = this.props
		dispatch(ActionCreators.bibleChapter({ id:bible.version.id, reference: book.chapters[0].usfm }))
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

	render() {
		const { bible } = this.props
		const { results, versions } = this.state

		let resultItems = results.map((r) => {
			return (<li key={r.language_tag}>{r.name} {r.local_name}</li>)
		})

		let versionItems = versions.map((v) => {
			return (<li key={v.id}>{v.abbreviation} {v.title}</li>)
		})

		const books = Array.isArray(bible.books.all) ? bible.books.all.map((book) => {
			return (<li key={`BOOK${book.usfm}`}><a onClick={this.getBook.bind(this, book)}>{book.human}</a></li>)
		}) : []

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
						<ul>
							{books}
						</ul>
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
