import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import Books from './Books'
import Chapters from './Chapters'

class ChapterPicker extends Component {

	render() {
		const { bookList, chapterList, getBook, getChapter, selectedBook, selectedChapter } = this.props

		var books, chapters = null

		if (bookList) {
			books = <Books list={bookList} onSelect={getBook} initialSelection={selectedBook} />
		}
		if (chapterList) {
			chapters = <Chapters list={chapterList} onSelect={getChapter} initialSelection={selectedChapter} />
		}

		return (
			<div className='chap-picker'>
				<div className='book-container'>
					<div className='header'>BOOK</div>
					<div>{ books }</div>
				</div>
				<div className='chapter-container'>
					<div className='header'>CHAPTER</div>
					<div>{ chapters }</div>
				</div>
			</div>
		)
	}
}


/**
 *
 */
ChapterPicker.propTypes = {
	bookList: React.PropTypes.array,
	chapterList: React.PropTypes.object,
	selectedBook: React.PropTypes.string,
	selectedChapter: React.PropTypes.string,
	getBook: React.PropTypes.func,
	getChapter: React.PropTypes.func
}

export default ChapterPicker