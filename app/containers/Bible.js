import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'
import Books from '../features/Bible/components/chapterPicker/Books'
import Chapters from '../features/Bible/components/chapterPicker/Chapters'



class BibleView extends Component {

// *********** BOOK | CHAPTER SELECTOR ********** //
	constructor(props) {
		super(props)
		this.state = { selectedBook: 'MAT', selectedChapter: 'MAT.1' }
	}
// ********************************************** //

	getVersions() {
		const { dispatch } = this.props
		dispatch(ActionCreators.bibleVersions({ language_tag: 'eng', type: 'all' }))
		dispatch(ActionCreators.bibleConfiguration())
		dispatch(ActionCreators.loadVersionAndChapter({ id: 100, reference: 'MAT.1' }))
		dispatch(ActionCreators.momentsColors())
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
	render() {
		const { bible } = this.props

		let versions = []
		if (typeof bible.versions.byLang !== 'undefined' && typeof bible.versions.byLang.eng !== 'undefined') {
			Object.keys(bible.versions.byLang.eng).forEach((versionId) => {
				const version = bible.versions.byLang.eng[versionId]
				versions.push(<li key={`VID${versionId}`}><a onClick={this.getVC.bind(this, version)}>{version.title}</a></li>)
			})
		}

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
						<ul>
							{versions}
						</ul>
					</div>
					<div className="columns medium-6">
						<div dangerouslySetInnerHTML={{ __html: bible.chapter.content }} />
					</div>
					<div className="columns medium-3">
						{ books }
					</div>
					<div className="columns medium-3">
						{ chapters }
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
