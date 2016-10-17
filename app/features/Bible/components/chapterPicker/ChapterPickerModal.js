import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Books from './Books'
import Chapters from './Chapters'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class ChapterPickerModal extends Component {

	render() {

		const {
			bookList,
			chapterList,
			getBook,
			getChapter,
			selectedBook,
			selectedChapter,
			classes,
			toggle,
			booklistSelectionIndex,
			chapterlistSelectionIndex,
			onMouseOver
		} = this.props

		let books, chapters = null

		// apply the correct mobile class from the click handlers passed down
		let classNames = (classes) ? `chapter-picker-modal ${classes}` : 'chapter-picker-modal'

		/**
		 * 	3 scenarios of rendering:
		 *
		 * 			all based on which inputs this component receives.
		 * 			handling the logic of which lists to render will be done by the parent by passing down the appropriate
		 * 			params.
		 *
		 * 			1. Both book list and chapter list
		 * 					triggered by: dropdown arrow
		 *
		 * 					this only happens if both the bookList, chapterList, and selectedBook are passed to this component
		 *
		 * 					mobile:
		 *						selecting book and chapter and prev arrow determine the class passed down to this component which
		 *						hides and shows the appropriate list for mobile view
		 *
		 * 			2. Just book list
		 * 					triggered by: filtering for book
		 *
		 * 					this only happens if the bookList is passed but either chapterList or selectedBook isn't passed
		 *
		 * 			3. Just chapter list
		 * 					triggered by: filtering for chapter
		 *
		 * 					this only happens if the bookList is not passed, but both chapterList and selectedBook are passed
		 */

		if (bookList) {
			let bookFocus = false
			// if we're rendering just the book list, let's handle the list selection stuff
			// this tells the books component to fire onMouseOver and style the focus list element
			if (!(chapterList && selectedBook)) {
				bookFocus = true
			}
			books = (
				<div className='book-container'>
					<div className='header vertical-center horizontal-center'><FormattedMessage id="Reader.chapterpicker.book label" /></div>
					<Books list={bookList} onSelect={getBook} initialSelection={selectedBook} focus={bookFocus} listSelectionIndex={booklistSelectionIndex} onMouseOver={onMouseOver}/>
				</div>
			)
		}

		if (chapterList && selectedBook) {
			let chapterFocus = false
			// if we're rendering just the chapter list, let's handle the list selection stuff
			// this tells the chapters component to fire onMouseOver and style the focus list element
			if (!bookList) {
				chapterFocus = true
			}
			chapters = (
				<div className='chapter-container'>
					<div className='header vertical-center'>
						<a className='prev columns medium-4' onClick={toggle}><p>&larr;</p></a>
						<p className='columns medium-4'><FormattedMessage id="Reader.chapterpicker.chapter label" /></p>
						<a className='cancel columns medium-4'><FormattedMessage id="Reader.header.cancel" /></a>
					</div>
					<Chapters list={chapterList} onSelect={getChapter} initialSelection={selectedChapter} listSelectionIndex={chapterlistSelectionIndex} focus={chapterFocus} onMouseOver={onMouseOver} />
				</div>
			)
		}


		return (
			<div className={classNames} >
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
 *	@bookList										array of books to be rendered. if null, then we only render chapter list
 *															(as long as selectedChapter is present)
 *	@chapterList								object containing all the chapters of the selected book. only renders if
 *															both the object is present and selectedBook is present
 *	@selectedBook								the book to get the chapters for (logic in parent). if this isn't present, then we won't render
 *															any chapters. this is also passed down to the book list for highlighting the selected book
 *	@selectedChapter						currently selected chapter, used for highlighting the chapter in chapter list
 *	@getBook										function passed down to the book list to call when a book is selected
 *	@getChapter									function passed down to the chapter list to call when a chapter is selected
 *	@classes										classes to apply. for showing and hiding on mobile views
 *	@toggle											function to call on prev arrow click on chapter header to hide chaps and show books
 * 	@booklistSelectionIndex 		index for selecting list element with arrow keys
 * 	@chapterlistSelectionIndex 	index for selecting list element with arrow keys
 * 	@onMouseOver								function to call when hovering over list element
 *
 */
ChapterPickerModal.propTypes = {
	bookList: React.PropTypes.array,
	chapterList: React.PropTypes.object,
	selectedBook: React.PropTypes.string,
	selectedChapter: React.PropTypes.string,
	getBook: React.PropTypes.func,
	getChapter: React.PropTypes.func,
	classes: React.PropTypes.string,
	toggle: React.PropTypes.func,
	booklistSelectionIndex: React.PropTypes.number,
	chapterlistSelectionIndex: React.PropTypes.number,
	onMouseOver: React.PropTypes.func
}

export default ChapterPickerModal