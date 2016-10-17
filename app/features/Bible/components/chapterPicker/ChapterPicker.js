import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import Filter from '../../../../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cookie from 'react-cookie';
import moment from 'moment'
import ChapterPickerModal from './ChapterPickerModal'
import Label from './Label'


class ChapterPicker extends Component {

	constructor(props) {
		super(props)
		const { chapter, selectedLanguage, books, bookMap } = props

		this.state = {
			selectedBook: chapter.reference.usfm.split('.')[0],
			selectedChapter: chapter.reference.usfm,
			selectedVersion: chapter.reference.version_id,
			selectedLanguage: selectedLanguage,
			books: books,
			chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters,
			inputValue: chapter.reference.human,
			booklistSelectionIndex: 0,
			chapterlistSelectionIndex: 0,
			cancelBlur: false,
			inputDisabled: false,
			dropdown: false,
			listErrorAlert: false,
			classes: 'hide-chaps'
		}
	}

	componentDidMount() {
		const { books } = this.props
		// build books index client side when the component renders
		Filter.build("BooksStore", [ "human", "usfm" ])
		Filter.add("BooksStore", books)
	}

	/**
	 * on component update, we're going to scroll the active/focused elements into view if their
	 * index has changed
	 *
	 * @param  prevProps  				The previous properties
	 * @param  prevState  				The previous state
	 */
	componentDidUpdate(prevProps, prevState) {
		const {
			chapterlistSelectionIndex,
			booklistSelectionIndex,
			dropdown,
			books,
			chapters
		} = this.state

		let focusElement = document.getElementsByClassName('focus')[0]
		let activeElements = document.getElementsByClassName('active')
		let containerElement = document.getElementsByClassName('modal')[0]
		let listElement = null

		// let's check if any selection index has changed, and then scroll to the correct
		// positions to make sure the selected elements are in view
		if (chapterlistSelectionIndex !== prevState.chapterlistSelectionIndex) {
			listElement = document.getElementsByClassName('chapter-list')[0]
			this.scrollList(focusElement, containerElement, listElement)
		}
		if (booklistSelectionIndex !== prevState.booklistSelectionIndex) {
			listElement = document.getElementsByClassName('book-list')[0]
			this.scrollList(focusElement, containerElement, listElement)
		}
		// scroll to the actively selected book and chapter on dropdown
		if ((dropdown !== prevState.dropdown) && books && chapters) {
			listElement = document.getElementsByClassName('book-list')[0]
			this.scrollList(activeElements[0], containerElement, listElement)
			listElement = document.getElementsByClassName('chapter-list')[0]
			this.scrollList(activeElements[1], containerElement, listElement)
		}

	}

	getBook(selectedBook, filtering) {
		const { books, bookMap } = this.props
		this.setState({
			selectedBook: selectedBook.usfm,
			inputValue: `${selectedBook.human} `,
			// if we're filtering, then don't render books after book selection
			books: filtering ? null : books,
			chapters: books[bookMap[selectedBook.usfm]].chapters,
			dropdown: true,
			booklistSelectionIndex: 0,
		})
		this.toggleChapterPickerList()
	}

	getChapter(selectedChapter) {
		const { dispatch, chapter } = this.props
		if (selectedChapter && selectedChapter.usfm) {
			this.setState({
				selectedChapter: selectedChapter.usfm,
				inputValue: `${this.state.inputValue} ${selectedChapter.human}`,
				dropdown: false,
				chapterlistSelectionIndex: 0
			})
			dispatch(ActionCreators.bibleChapter({ id: this.state.selectedVersion, reference: selectedChapter.usfm })).then((chapter) => {
				this.setState({ listErrorAlert: false })
				// then write cookie for selected chapter
				this.toggleChapterPickerList()
				cookie.save('last_read', selectedChapter.usfm, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
			}, (error) => {
				this.setState({ listErrorAlert: true })
			})
		} else {
			this.setState({ listErrorAlert: true })
		}
	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		const { classes } = this.state
		classes == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
	}


	/**
	 * scroll an overflowed list so that the elementToView is visible
	 *
	 * @param      {<NodeList item>}   elementToView     list element to make visible
	 * @param      {<NodeList item>}   elementContainer  element containing the elementToView
	 * @param      {<NodeList item>}   listElement       actual list (<ul>?) element to scroll (could be the same as container)
	 *
	 *
	 */
	scrollList(elementToView, elementContainer, listElement) {
		let containerHeight, topPos, listItem, temp = null

		if (typeof window !== 'undefined' && elementToView && elementContainer && listElement) {
			temp = window.getComputedStyle(elementContainer, null).getPropertyValue('padding-top')
			temp = parseInt(temp) + parseInt(window.getComputedStyle(elementContainer, null).getPropertyValue('padding-bottom'))
			// temp holds the top and bottom padding
			// usable space is the offsetHeight - padding
			containerHeight = elementContainer.offsetHeight - temp
			// amount of pixels away from the top of the container
			topPos = elementToView.offsetTop
			if (!containerHeight || !topPos) return false
			// get the height of the the first list item in the list to scroll
			listItem = listElement.querySelector('li:first-of-type').offsetHeight
			// actually do the scrolling now
			// scroll the top of the list to show the elementToView on the bottom
			listElement.scrollTop = (topPos - (containerHeight - listItem))
		}

	}


	handleLabelChange(inputValue) {
		const { books, bookMap } = this.props
		const { selectedBook } = this.state

		let results = Filter.filter("BooksStore", inputValue.trim())

		this.setState({ inputValue: inputValue })

		// if the input already matches a book exactly, let's filter chapters
		if (results.length > 0 && `${results[0].human} ` == inputValue) {
			// getBook will set state appropriately
			this.getBook(results[0], true)
		// if we already have book and are now filtering chapters, let's keep the chapter modal open
		} else if (inputValue.includes(`${books[bookMap[selectedBook]].human} `)) {
			// let's get the chapter info from the input value
			let chapterSplit = inputValue.split(' ')
			let chapterNum = parseInt(chapterSplit[chapterSplit.length - 1])

			if (chapterNum == 'undefined') {
				this.setState({
					chapterlistSelectionIndex: 0
				})
			} else {
				this.setState({
					chapterlistSelectionIndex: chapterNum - 1,
				})
			}
			this.setState({ books: null, dropdown: true })
		// or we're actually filtering book names
		} else if (results.length > 0) {
			this.setState({ books: results, chapters: null, dropdown: true, booklistSelectionIndex: 0 })
			this.toggleChapterPickerList()
		}
	}

	handleDropDownClick() {
		const { books, chapter, bookMap } = this.props
		const { selectedBook } = this.state

		// don't close the dropdown modal when losing focus of the input,
		// because we're clicking the dropdown (not some other random place)
		this.setState({ cancelBlur: true })

		// if the full modal is being rendered, let's toggle the dropdown rendering
		if (this.state.books && this.state.chapters) {
			// if the user is closing the dropdown and hasn't selected anything, let's
			// fill the input back up with the correct reference
			if (this.state.dropdown) {
				this.setState({
					dropdown: false,
					inputValue: chapter.reference.human,
					selectedBook: chapter.reference.usfm.split('.')[0],
					selectedChapter: chapter.reference.usfm,
					chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters,
					inputDisabled: false,
				})
			// we're opening the dropdown so let's disable the input field
			} else {
				this.setState({
					dropdown: true,
					inputDisabled: true,
					books: books,
					chapters: books[bookMap[selectedBook]].chapters
				})

			}
		// not full modal
		// this will be fired only when a user has been filtering and then clicks on the dropwdown
		} else {
			this.setState({
				dropdown: true,
				inputDisabled: true,
				books: books,
				chapters: books[bookMap[selectedBook]].chapters
			})
		}

	}



	handleListHover(context, index) {
		if (context == "books") {
			this.setState({ booklistSelectionIndex: index })
		} else if (context == "chapters") {
			this.setState({ chapterlistSelectionIndex: index })
		}
	}



	handleLabelKeyDown(event, keyEventName, keyEventCode) {
		const { books, bookMap } = this.props
		const {
			inputValue,
			booklistSelectionIndex,
			chapterlistSelectionIndex,
			selectedBook
		} = this.state


		// filtering books
		if (this.state.books && !this.state.chapters) {
			this.setState({ chapterlistSelectionIndex: 0 })

			if (keyEventName == "ArrowUp") {
				event.preventDefault()

				if (booklistSelectionIndex > 0 ) {
					this.setState({ booklistSelectionIndex: booklistSelectionIndex - 1 })
				} else {
					this.setState({ booklistSelectionIndex: this.state.books.length - 1 })
				}
			}
			if (keyEventName == "ArrowDown") {
				event.preventDefault()

				if (booklistSelectionIndex < this.state.books.length - 1) {
					this.setState({ booklistSelectionIndex: booklistSelectionIndex + 1 })
				} else {
					this.setState({ booklistSelectionIndex: 0 })
				}
			}
			if (keyEventName == "Enter" || keyEventName == "ArrowRight" || keyEventCode == 32) {
				event.preventDefault()
				//
				this.getBook(this.state.books[booklistSelectionIndex], true)
			}

		// filtering chapters
		} else if (this.state.chapters) {

			this.setState({ booklistSelectionIndex: 0 })
			let chapterKeys = Object.keys(books[bookMap[selectedBook]].chapters)

			if (keyEventName == "ArrowUp") {
				event.preventDefault()

				if (chapterlistSelectionIndex > 4 ) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex - 5 })
				} else {
					this.setState({ chapterlistSelectionIndex: 0 })
				}
			}
			if (keyEventName == "ArrowDown") {
				event.preventDefault()

				if (chapterlistSelectionIndex < chapterKeys.length - 6) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex + 5 })
				} else {
					this.setState({ chapterlistSelectionIndex: chapterKeys.length - 1 })
				}
			}
			if (keyEventName == "ArrowLeft") {
				event.preventDefault()

				if (chapterlistSelectionIndex > 0 ) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex - 1 })
				} else {
					this.setState({ chapterlistSelectionIndex: chapterKeys.length - 1 })
				}
			}
			if (keyEventName == "ArrowRight") {
				if (chapterlistSelectionIndex < chapterKeys.length - 1) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex + 1 })
				} else {
					this.setState({ chapterlistSelectionIndex: 0 })
				}
			}
			if (keyEventName == "Enter") {
				let chapIndex = chapterKeys[chapterlistSelectionIndex]
				this.getChapter((books[bookMap[selectedBook]].chapters)[chapIndex])
			}
		}
	}



	onBlur() {
		const { books, chapter, bookMap } = this.props
		let dat = this

		// when we click out of the input, we need to wait and check if either
		// the dropdown or a book/chapter has been clicked
		// otherwise let's close and reset
		setTimeout(function() {

			// cancel blur is only true when dropdown or book/chapter is clicked
			if (dat.state.cancelBlur) {
				dat.setState({ cancelBlur: false })
			} else {
				dat.setState({
					dropdown: false,
					inputValue: chapter.reference.human
				})

				let dis = dat
				setTimeout(function() {
					// delay the restoration of the full modal so the closing transition
					// doesn't look weird
					dis.setState({
						books: books,
						chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters
					})

				}, 400)

			}

		}, 300)


	}


	render() {
		const { bookMap, chapter } = this.props
		const {
			books,
			chapters,
			dropdown,
			inputValue,
			classes,
			selectedBook,
			selectedChapter,
			selectedLanguage,
			selectedVersion,
			booklistSelectionIndex,
			chapterlistSelectionIndex,
			listErrorAlert,
			inputDisabled
		} = this.state

		let hide = (dropdown) ? '' : 'hide-modal'
		let errorModal = null

		if (listErrorAlert) {
			errorModal = (
				<div className='picker-error'>Oh noesssss</div>
			)
		}

		return (
			<div className={`chapter-picker-container`} >
				<Label
					input={inputValue}
					onClick={::this.handleDropDownClick}
					onChange={::this.handleLabelChange}
					onKeyDown={::this.handleLabelKeyDown}
					onBlur={::this.onBlur}
					disabled={inputDisabled}
				/>
				<div className={`modal ${hide}`} onClick={() => this.setState({ cancelBlur: true })}>
					<ChapterPickerModal
						classes={classes}
						bookList={books}
						chapterList={chapters}
						selectedBook={selectedBook}
						selectedChapter={selectedChapter}
						getChapter={::this.getChapter}
						getBook={::this.getBook}
						toggle={::this.toggleChapterPickerList}
						booklistSelectionIndex={booklistSelectionIndex}
						chapterlistSelectionIndex={chapterlistSelectionIndex}
						onMouseOver={::this.handleListHover}
						alert={listErrorAlert}
					/>
				</div>
			</div>
		)
	}
}


/**
 *
 */
ChapterPicker.propTypes = {
	books: React.PropTypes.array,
	bookMap: React.PropTypes.object,
	chapter: React.PropTypes.object,
	selectedLanguage: React.PropTypes.string
}

export default ChapterPicker