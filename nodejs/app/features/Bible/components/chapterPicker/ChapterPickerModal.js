import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import CustomScroll from 'react-custom-scroll'
import Books from './Books'
import Chapters from './Chapters'

function ChapterPickerModal(props) {
	const {
		bookList,
		chapterList,
		getBook,
		selectedBook,
		selectedChapter,
		classes,
		toggle,
		booklistSelectionIndex,
		chapterlistSelectionIndex,
		onMouseOver,
		alert,
		onCancel,
		versionID,
		versionAbbr,
		linkBuilder,
		params,
		localizedLink
	} = props

	let books, chapters = null

	// apply the correct mobile class from the click handlers passed down
	const classNames = (classes) ? `chapter-picker-modal ${classes}` : 'chapter-picker-modal'

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
				<CustomScroll allowOuterScroll={false}>
					<Books linkBuilder={linkBuilder} list={bookList} onSelect={getBook} initialSelection={selectedBook} focus={bookFocus} listSelectionIndex={booklistSelectionIndex} onMouseOver={onMouseOver} />
				</CustomScroll>
			</div>
		)
	}

	if (chapterList && selectedBook) {
		let chapterFocus = false
		let alertClass = ''
		// if we're rendering just the chapter list, let's handle the list selection stuff
		// this tells the chapters component to fire onMouseOver and style the focus list element
		if (!bookList) {
			chapterFocus = true
		}
		if (alert) {
			alertClass = 'picker-alert'
		}
		chapters = (
			<div className={`chapter-container ${alertClass}`}>
				<div className='header vertical-center horizontal-center'>
					<a tabIndex={0} className='prev columns medium-4' onClick={toggle}><p>&larr;</p></a>
					<p className='columns medium-4'><FormattedMessage id="Reader.chapterpicker.chapter label" /></p>
					<a tabIndex={0} className='cancel columns medium-4' onClick={onCancel}><FormattedMessage id="Reader.header.cancel" /></a>
				</div>
				{/* this is hidden on default and only shown if picker alert is applied to the parent */}
				<div className='picker-error'>
					<FormattedMessage id="Reader.chapterpicker.chapter unavailable" />
				</div>
				<CustomScroll allowOuterScroll={false}>
					<Chapters
						linkBuilder={linkBuilder}
						params={params}
						localizedLink={localizedLink}
						list={chapterList}
						selectedChapter={selectedChapter}
						listSelectionIndex={chapterlistSelectionIndex}
						focus={chapterFocus}
						onMouseOver={onMouseOver}
						alert={alert}
						versionID={versionID}
						versionAbbr={versionAbbr}
					/>
				</CustomScroll>
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


/**
 *
 *	Component containing both the book and chapter lists, and renders the
 *	appropriate one(s) based on the given inputs
 *
 *
 *	@param bookList										array of books to be rendered. if null, then we only render chapter list
 *															(as long as selectedChapter is present)
 *	@param chapterList								object containing all the chapters of the selected book. only renders if
 *															both the object is present and selectedBook is present
 *	@param selectedBook								the book to get the chapters for (logic in parent). if this isn't present, then we won't render
 *															any chapters. this is also passed down to the book list for highlighting the selected book
 *	@param selectedChapter						currently selected chapter, used for highlighting the chapter in chapter list
 *	@param getBook										function passed down to the book list to call when a book is selected
 *	@param versionID 									id of the selected version
 *	@param classes										classes to apply. for showing and hiding on mobile views
 *	@param toggle											function to call on prev arrow click on chapter header to hide chaps and show books
 * 	@param booklistSelectionIndex 		index for selecting list element with arrow keys
 * 	@param chapterlistSelectionIndex 	index for selecting list element with arrow keys
 * 	@param onMouseOver								function to call when hovering over list element
 * 	@param alert											show alert message
 *
 */
ChapterPickerModal.propTypes = {
	bookList: PropTypes.array,
	chapterList: PropTypes.object,
	selectedBook: PropTypes.string,
	selectedChapter: PropTypes.string,
	getBook: PropTypes.func,
	versionID: PropTypes.number,
	classes: PropTypes.string,
	toggle: PropTypes.func,
	booklistSelectionIndex: PropTypes.number,
	chapterlistSelectionIndex: PropTypes.number,
	onMouseOver: PropTypes.func,
	alert: PropTypes.bool,
	linkBuilder: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
	versionAbbr: PropTypes.string,
	params: PropTypes.object,
	localizedLink: PropTypes.func
}

ChapterPickerModal.defaultProps = {
	bookList: [],
	chapterList: {},
	selectedBook: null,
	selectedChapter: null,
	getBook: null,
	versionID: null,
	classes: null,
	toggle: null,
	booklistSelectionIndex: null,
	chapterlistSelectionIndex: null,
	onMouseOver: null,
	alert: false,
	onCancel: null,
	versionAbbr: null,
	params: null,
	localizedLink: null
}

export default ChapterPickerModal
