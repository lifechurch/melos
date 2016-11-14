import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import Filter from '../../../../lib/filter'
import scrollList from '../../../../lib/scrollToView'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import cookie from 'react-cookie';
import moment from 'moment'
import ChapterPickerModal from './ChapterPickerModal'
import Label from './Label'


class ChapterPicker extends Component {

	constructor(props) {
		super(props)
		const {
			chapter,
			books,
			bookMap,
			initialChapters,
			initialBook,
			initialInput,
			initialChapter
		} = props


		this.state = {
			selectedBook: initialBook,
			selectedChapter: initialChapter,
			inputValue: initialInput,
			chapters: initialChapters,
			books: books,
			booklistSelectionIndex: 0,
			chapterlistSelectionIndex: 0,
			cancelBlur: false,
			inputDisabled: false,
			filtering: false,
			dropdown: false,
			listErrorAlert: false,
			classes: 'hide-chaps'
		}

		this.handleDropDownClick = ::this.handleDropDownClick
		this.handleLabelChange = ::this.handleLabelChange
		this.handleLabelKeyDown = ::this.handleLabelKeyDown
		this.onBlur = ::this.onBlur
		this.getChapter = ::this.getChapter
		this.getBook = ::this.getBook
		this.toggleChapterPickerList = ::this.toggleChapterPickerList
		this.handleListHover = ::this.handleListHover
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
		const { books, togglePickerExclusion, chapter } = this.props
		const {
			chapterlistSelectionIndex,
			booklistSelectionIndex,
			dropdown,
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
			scrollList(focusElement, containerElement, listElement)
		}
		if (booklistSelectionIndex !== prevState.booklistSelectionIndex) {
			listElement = document.getElementsByClassName('book-list')[0]
			scrollList(focusElement, containerElement, listElement)
		}
		// scroll to the actively selected book and chapter on dropdown
		if ((dropdown !== prevState.dropdown) && this.state.books && chapters) {
			listElement = document.getElementsByClassName('book-list')[0]
			scrollList(activeElements[0], containerElement, listElement)
			listElement = document.getElementsByClassName('chapter-list')[0]
			scrollList(activeElements[1], containerElement, listElement)
		}

		// handle state change on dropdown open and close
		if (dropdown !== prevState.dropdown) {
			// if we're not filtering, disable the input
			if (dropdown && (this.state.books && this.state.chapters)) {
				this.setState({ inputDisabled: true })
			} else {
				this.setState({ inputDisabled: false })
				if (chapter.reference) {
					this.setState({ inputValue: chapter.reference.human })
				}
			}

			// let's tell the parent component that we're open
			// so that the versionPicker doesn't get opened
			if (dropdown) {
				togglePickerExclusion('chapter')
			} else {
				togglePickerExclusion('none')
			}

		}


	}

	/**
	 * Sets up state for the selected book
	 *
	 * @param      {<Object>}  selectedBook  The selected book
	 * @param      {<Bool>}    filtering     are we filtering book list?
	 *                                       this tells us whether to still render the book list
	 */
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
		const { getChapter, books, bookMap } = this.props

		if (selectedChapter && selectedChapter.usfm) {
			this.setState({
				selectedChapter: selectedChapter.usfm,
				inputValue: `${books[bookMap[selectedChapter.usfm.split('.')[0]]].human} ${selectedChapter.human}`,
				chapterlistSelectionIndex: 0,
				dropdown: false
			})
			getChapter(selectedChapter.usfm)
			this.setState({ listErrorAlert: false })
			this.toggleChapterPickerList()
			// then write cookie for selected chapter
			cookie.save('last_read', selectedChapter.usfm, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
		} else {
			this.setState({ listErrorAlert: true })
		}
	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		const { classes } = this.state
		classes == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
	}


	handleLabelChange(inputValue) {
		const { books, bookMap } = this.props
		const { selectedBook } = this.state

		// filter the books given the input change
		let results = Filter.filter("BooksStore", inputValue.trim())

		this.setState({ inputValue: inputValue, listErrorAlert: false, filtering: true })

		// if the input already matches a book exactly, let's filter chapters
		if (results.length > 0 && `${results[0].human} ` == inputValue) {
			// getBook will set state appropriately
			this.getBook(results[0], true)

		// if we already have book and are now filtering chapters, let's keep the chapter modal open
		} else if (inputValue.includes(`${books[bookMap[selectedBook]].human} `)) {
			// let's get the chapter info from the input value
			let chapterSplit = inputValue.split(' ')
			let chapterNum = parseInt(chapterSplit[chapterSplit.length - 1], 10)

			if (chapterNum == 'undefined') {
				this.setState({
					chapterlistSelectionIndex: 0
				})
			} else {
				this.setState({
					chapterlistSelectionIndex: books[bookMap[selectedBook]].chapterMap[chapterNum],
				})
			}
			this.setState({ books: null, dropdown: true })

		// or we're actually just filtering book names
		} else if (results.length > 0) {
			this.setState({ books: results, chapters: null, dropdown: true, booklistSelectionIndex: 0 })
			this.toggleChapterPickerList()
		}
	}

	/**
	 * This is called when the dropdown arrow is clicked to render the book and chapter
	 * picker modal
	 */
	handleDropDownClick() {
		const { books, bookMap, chapter, cancelDropDown } = this.props
		const { selectedBook } = this.state

		// don't close the dropdown modal when losing focus of the input,
		// because we're clicking the dropdown (not some other random place)
		this.setState({ cancelBlur: true, filtering: false })

		if (!cancelDropDown) {
			// if the full modal is being rendered, let's toggle the dropdown rendering
			if (this.state.books && this.state.chapters) {
				// if the user is closing the dropdown and hasn't selected anything, let's
				// fill the input back up with the correct reference
				if (this.state.dropdown) {
					// if chapter content is legit, let's reset accordingly
					// not changing chapter on chapter/version error
					if (chapter.reference.usfm) {
						this.setState({
							selectedBook: chapter.reference.usfm.split('.')[0],
							selectedChapter: chapter.reference.usfm
						})
					}
					this.setState({
						dropdown: false,
						listErrorAlert: false
					})
				// we're opening the dropdown so let's disable the input field
				} else {
					this.setState({
						dropdown: true,
						books: books
					})

				}
			// not full modal
			// this will be fired only when a user has been filtering and then clicks on the dropwdown
			} else {
				this.setState({
					dropdown: true,
					books: books,
					listErrorAlert: false
				})
			}
			// in all cases, let's reset chapters if chapter exists
			if (chapter.reference.usfm) {
				this.setState({
					chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters
				})
			} else {
				// if we've rendered a bad chapter, then let's select the correct stuff
				// for the new version
				this.setState({
					selectedBook: books[0].usfm,
					selectedChapter: books[0].chapters[Object.keys(books[0].chapters)[0]].usfm,
					chapterlistSelectionIndex: 0,
					booklistSelectionIndex: 0,
					chapters: books[0].chapters
				})
			}
		}
	}

	/**
	 * this handles changing the selection index on hover of the list in context
	 *
	 * @param      {string}  context  The list that we're changing the index on
	 * @param      {number}  index    The index of the book or chapter being hovered over
	 */
	handleListHover(context, index) {
		if (context == "books") {
			this.setState({ booklistSelectionIndex: index })
		} else if (context == "chapters") {
			this.setState({ chapterlistSelectionIndex: index })
		}
	}


	/**
	 * this handles pressing certain keys in the ChapterPicker label
	 *
	 * @param      {object}  event         KeyDown event
	 * @param      {string}  keyEventName  Name of key event used for all except space bar
	 * @param      {number}  keyEventCode  Code value of key event
	 */
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
			if (keyEventName == "Enter" || keyEventName == "ArrowRight") {
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


	/**
	 * handles clicking out of the ChapterPicker label/input
	 *
	 * if the blur target is a book or chapter, we need to do the right thing and get
	 * what was clicked, otherwise we're going to close the modal and reset the state of
	 * the dropdown items
	 */
	onBlur() {
		const { books, bookMap } = this.props
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
					inputValue: dat.state.inputValue
				})

				let dis = dat
				setTimeout(function() {
					// delay the restoration of the full modal so the closing transition
					// doesn't look weird
					dis.setState({
						books: books,
						chapters: dis.state.chapters,
						listErrorAlert: false
					})
				}, 700)
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
			booklistSelectionIndex,
			chapterlistSelectionIndex,
			listErrorAlert,
			inputDisabled,
			filtering
		} = this.state

		let hide = (dropdown) ? '' : 'hide-modal'

		return (
			<div className={`chapter-picker-container`} >
				<Label
					input={inputValue}
					onClick={this.handleDropDownClick}
					onChange={this.handleLabelChange}
					onKeyDown={this.handleLabelKeyDown}
					dropdown={dropdown}
					filtering={filtering}
					onBlur={this.onBlur}
					disabled={inputDisabled}
				/>
				<div className={`modal ${hide}`} onClick={() => this.setState({ cancelBlur: true })}>
					<ChapterPickerModal
						classes={classes}
						bookList={books}
						chapterList={chapters}
						selectedBook={selectedBook}
						selectedChapter={selectedChapter}
						getChapter={this.getChapter}
						getBook={this.getBook}
						toggle={this.toggleChapterPickerList}
						booklistSelectionIndex={booklistSelectionIndex}
						chapterlistSelectionIndex={chapterlistSelectionIndex}
						onMouseOver={this.handleListHover}
						alert={listErrorAlert}
						cancel={() => this.setState({ dropdown: false })}
					/>
				</div>
			</div>
		)
	}
}


/**
 *	@books: 							array of books for preselected version/language
 *	@bookMap: 						object relating book usfm to array index
 *	@chapter: 						rendered chapter object
 */
ChapterPicker.propTypes = {
	books: React.PropTypes.array,
	bookMap: React.PropTypes.object,
	chapter: React.PropTypes.object,
	getChapter: React.PropTypes.func
}

export default ChapterPicker