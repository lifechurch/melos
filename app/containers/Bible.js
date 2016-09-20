import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'
import Books from '../features/Bible/components/chapterPicker/Books'

class BibleView extends Component {
	getVersions() {
		const { dispatch } = this.props
		dispatch(ActionCreators.bibleVersions({ language_tag: 'eng', type: 'all' }))
		dispatch(ActionCreators.bibleConfiguration())
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

	render() {
		const { bible } = this.props

		let versions = []
		if (typeof bible.versions.byLang !== 'undefined' && typeof bible.versions.byLang.eng !== 'undefined') {
			Object.keys(bible.versions.byLang.eng).forEach((versionId) => {
				const version = bible.versions.byLang.eng[versionId]
				versions.push(<li key={`VID${versionId}`}><a onClick={this.getVC.bind(this, version)}>{version.title}</a></li>)
			})
		}

		// const books = Array.isArray(bible.books.all) ? bible.books.all.map((book) => {
		// 	return (<li key={`BOOK${book.usfm}`}><a onClick={this.getBook.bind(this, book)}>{book.human}</a></li>)
		// }) : []

		const books = Array.isArray(bible.books.all) ? <Books bookList={bible.books.all} clickHandler={::this.getBook} /> : []

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
