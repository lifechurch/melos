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

	// build books index client side when the component renders
	componentDidMount() {
		const { books } = this.props

		console.time("Build Books Index")
		Filter.build("BooksStore", [ "human", "usfm" ])
		console.timeEnd("Build Books Index")

		console.time("Add Items")
		Filter.add("BooksStore", books)
		console.timeEnd("Add Items")
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
		this.setState({
			selectedChapter: selectedChapter.usfm,
			inputValue: `${this.state.inputValue} ${selectedChapter.human}`,
			dropdown: false,
			chapterlistSelectionIndex: 0
		})
		this.toggleChapterPickerList()
		// make the api call
		dispatch(ActionCreators.bibleChapter({ id: this.state.selectedVersion, reference: selectedChapter.usfm }))
		// then write cookie for selected chapter
		cookie.save('last_read', selectedChapter.usfm, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		const { classes } = this.state
		classes == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
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

			if (chapterNum == undefined) {
				this.setState({
					chapterlistSelectionIndex: 0
				})
			} else {
				this.setState({
					chapterlistSelectionIndex: chapterNum - 1,
				})
			}
			this.setState({ books: null })
		// or we're actually filtering book names
		} else if (results.length > 0) {
			this.setState({ books: results, chapters: null, dropdown: true, booklistSelectionIndex: 0 })
		}
	}


	scrollList(elementToView, elementContainer, list, direction, amount) {

		let focusElement, containerHeight, topPos, listElement, listItem = null
		if (typeof window !== 'undefined') {
			focusElement = document.getElementsByClassName(elementToView)[0]
			containerHeight = document.getElementsByClassName(elementContainer)[0].offsetHeight
			topPos = focusElement.offsetTop
			listElement = document.getElementsByClassName(`${list}-list`)[0]
			listItem = listElement.querySelector('li:first-of-type').offsetHeight
		}

// TODO: check if element is not visible first before scrolling?
		if (focusElement && listElement) {

			if (direction === 'up') {
				if (amount === 'item') {
					listElement.scrollTop = (topPos - (containerHeight))
				} else if (amount === 'top') {
					listElement.scrollTop = 0
				}

			} else if (direction === 'down') {
				if (amount === 'item') {
					listElement.scrollTop = (topPos - (containerHeight - (2 * listItem)))
				} else if (amount === 'bottom') {
					listElement.scrollTop = 10000
				}

			}

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
					this.scrollList('focus', 'modal', 'book', 'up', 'item')
				} else {
					this.setState({ booklistSelectionIndex: this.state.books.length - 1 })
					this.scrollList('focus', 'modal', 'book', 'down', 'bottom')
				}
			}
			if (keyEventName == "ArrowDown") {
				event.preventDefault()

				if (booklistSelectionIndex < this.state.books.length - 1) {
					this.setState({ booklistSelectionIndex: booklistSelectionIndex + 1 })
					this.scrollList('focus', 'modal', 'book', 'down', 'item')
				} else {
					this.setState({ booklistSelectionIndex: 0 })
					this.scrollList('focus', 'modal', 'book', 'up', 'top')
				}
			}
			if (keyEventName == "Enter" || keyEventName == "ArrowRight" || keyEventCode == 32) {
				event.preventDefault()
				//
				this.getBook(this.state.books[booklistSelectionIndex], true)
			}



		// filtering chapters
		} else if (this.state.chapters) {

			let chapterKeys = Object.keys(books[bookMap[selectedBook]].chapters)
			this.setState({ booklistSelectionIndex: 0 })

			if (keyEventName == "ArrowUp") {
				event.preventDefault()

				if (chapterlistSelectionIndex > 4 ) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex - 5 })
					this.scrollList('focus', 'modal', 'chapter', 'up', 'item')
				} else {
					this.setState({ chapterlistSelectionIndex: 0 })
					this.scrollList('focus', 'modal', 'chapter', 'up', 'top')
				}
			}
			if (keyEventName == "ArrowDown") {
				event.preventDefault()

				if (chapterlistSelectionIndex < chapterKeys.length - 6) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex + 5 })
					this.scrollList('focus', 'modal', 'chapter', 'down', 'item')
				} else {
					this.setState({ chapterlistSelectionIndex: chapterKeys.length - 1 })
					this.scrollList('focus', 'modal', 'chapter', 'down', 'bottom')
				}
			}
			if (keyEventName == "ArrowLeft") {
				event.preventDefault()

				if (chapterlistSelectionIndex > 0 ) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex - 1 })
					this.scrollList('focus', 'modal', 'chapter', 'up', 'item')
				} else {
					this.setState({ chapterlistSelectionIndex: chapterKeys.length - 1 })
					this.scrollList('focus', 'modal', 'chapter', 'down', 'bottom')
				}
			}
			if (keyEventName == "ArrowRight") {
				if (chapterlistSelectionIndex < chapterKeys.length - 1) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex + 1 })
					this.scrollList('focus', 'modal', 'chapter', 'down', 'item')
				} else {
					this.setState({ chapterlistSelectionIndex: 0 })
					this.scrollList('focus', 'modal', 'chapter', 'up', 'top')
				}
			}
			if (keyEventName == "Enter") {
				let chapIndex = chapterKeys[chapterlistSelectionIndex]
				this.getChapter((books[bookMap[selectedBook]].chapters)[chapIndex])
			}
		}
	}

	handleListHover(context, index) {
		if (context == "books") {
			this.setState({ booklistSelectionIndex: index })
		} else if (context == "chapters") {
			this.setState({ chapterlistSelectionIndex: index })
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
					inputDisabled: false,
				})

			// we're opening the dropdown so let's disable the input field
			} else {
				this.setState({
					dropdown: true,
					inputDisabled: true
				})
			}

		// not full modal
		// this will be fired only when a user has been filtering and then clicks on the dropwdown
		} else {
			this.setState({
				dropdown: true,
				inputDisabled: true
			})
		}

		// in all cases, the dropdown needs both lists
		this.setState({
			books: books,
			chapters: books[bookMap[selectedBook]].chapters
		})

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
					inputValue: chapter.reference.human,
					books: books,
					chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters
				})
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

		let hide = (dropdown) ? '' : 'hide'

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