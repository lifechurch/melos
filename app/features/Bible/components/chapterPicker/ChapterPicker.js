import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../actions/creators'
import Books from './Books'
import Chapters from './Chapters'

class ChapterPicker extends Component {

	render() {
		const { bookList, chapterList, getBook, getChapter, selectedBook, selectedChapter } = this.props

		var books, chapters = null

	/**
	 * 	3 scenarios of rendering:
	 *
	 * 			all based on which inputs this component receives.
	 * 			handling the logic of which lists to render will be done by the parent by passing down the appropriate
	 * 			params. (I think this logic will be based off of what is in the filter input component?)
	 *
	 * 			1. Both book list and chapter list
	 * 					triggered by: dropdown arrow
	 *
	 * 					this only happens if both the bookList, chapterList, and selectedBook are passed to this component
	 *
	 * 			2. Just book list
	 * 					triggered by: filtering for book, or dropdown arrow on mobile (mobile will always show book first, then chapter
	 * 						when using the dropdown button)
	 *
	 * 					this only happens if the bookList is passed but either chapterList or selectedBook isn't passed
	 *
	 * 			3. Just chapter list
	 * 					triggered by: filtering for chapter, or clicking on chapter from dropdown on mobile
	 */

		if (bookList) {
			books = (
				<div className='book-container'>
					<div className='header'>BOOK</div>
					<Books list={bookList} onSelect={getBook} initialSelection={selectedBook} />
				</div>
			)
		}

		if (chapterList && selectedBook) {
			chapters = (
				<div className='chapter-container'>
					<div className='header'>CHAPTER</div>
					<Chapters list={chapterList} onSelect={getChapter} initialSelection={selectedChapter} />
				</div>
			)
		}

		return (
			<div className='chap-picker'>
				{ books }
				{ chapters }
			</div>
		)
	}
}


/**
 *
 *	Component containing both the book and chapter lists, and renders the
 *	appropriate one(s) based on the given inputs
 *
 *
 *	@bookList						array of books to be rendered. if null, then we only render chapter list
 *											(as long as selectedChapter is present)
 *	@chapterList				object containing all the chapters of the selected book. only renders if
 *											both the object is present and selectedBook is present
 *	@selectedBook				the book to get the chapters for (logic in parent). if this isn't present, then we won't render
 *											any chapters. this is also passed down to the book list for highlighting the selected book
 *	@selectedChapter		currently selected chapter, used for highlighting the chapter in chapter list
 *	@getBook						function passed down to the book list to call when a book is selected
 *	@getChapter					function passed down to the chapter list to call when a chapter is selected
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