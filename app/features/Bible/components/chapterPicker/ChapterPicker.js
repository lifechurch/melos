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

	getBook(selectedBook) {
		const { books, bookMap } = this.props
		console.log('gettin dem books', selectedBook)
		this.setState({
			selectedBook: selectedBook.usfm,
			inputValue: `${selectedBook.human} `,
			chapters: books[bookMap[selectedBook.usfm]].chapters,
			books: null,
			dropdown: true,
			booklistSelectionIndex: 0,
		})
		this.toggleChapterPickerList()
	}

	getChapter(selectedChapter) {
		const { dispatch, chapter } = this.props
		console.log(selectedChapter)
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

	// getFilter(inputValue) {
	// 	const { books, bookMap } = this.props
	// 	const { selectedBook } = this.state

	// 	let filterContext = null

	// 	if (results.length > 0 && `${results[0].human} ` == inputValue) {
	// 	 	filterContext == "book match"
	// 	} else if (inputValue.includes(`${books[bookMap[selectedBook]].human} `)) {
	// 		filterContext == "chapters"
	// 	} else if (results.length > 0) {
	// 		filterContext == "books"
	// 	}

	// 	return { results: results, context: filterContext }
	// }

	handleLabelChange(inputValue) {
		const { books, bookMap } = this.props
		const { selectedBook } = this.state

		let results = Filter.filter("BooksStore", inputValue.trim())

		this.setState({ inputValue: inputValue })

		// if the input already matches a book exactly, let's filter chapters
		if (results.length > 0 && `${results[0].human} ` == inputValue) {
			// getBook will set state appropriately
			this.getBook(results[0])
		// if we already have book and are now filtering chapters, let's keep the chapter modal open
		} else if (inputValue.includes(`${books[bookMap[selectedBook]].human} `)) {
			// let's get the chapter info from the input value
			let chapterSplit = inputValue.split(' ')
			let chapterNum = parseInt(chapterSplit[chapterSplit.length - 1])
			// let chapIndex = Object.keys(books[bookMap[selectedBook]].chapters)[chapterNum - 1]

			if (chapIndex == undefined) {
				this.setState({
					listErrorAlert: true
				})
			} else {
				this.setState({
					chapterlistSelectionIndex: chapNum,
					listErrorAlert: false
				})

			}
		// or we're actually filtering book names
		} else if (results.length > 0) {
			this.setState({ books: results, chapters: null, dropdown: true })
		}
	}

	handleLabelKeyUp(keyEventName, keyEventCode) {
		const { books, bookMap } = this.props
		const {
			inputValue,
			booklistSelectionIndex,
			chapterlistSelectionIndex,
			selectedBook
		} = this.state


		// filtering books
		if (this.state.books && !this.state.chapters) {
			if (keyEventName == "ArrowUp") {
				if (booklistSelectionIndex > 0 ) {
					this.setState({ booklistSelectionIndex: booklistSelectionIndex - 1 })
				} else {
					this.setState({ booklistSelectionIndex: books.length - 1 })
				}
			}
			if (keyEventName == "ArrowDown") {
				if (booklistSelectionIndex < books.length - 1) {
					this.setState({ booklistSelectionIndex: booklistSelectionIndex + 1 })
				} else {
					this.setState({ booklistSelectionIndex: 0 })
				}
			}
			if (keyEventName == "Enter" || keyEventName == "ArrowRight" || keyEventCode == 32) {
				//
				this.getBook(this.state.books[booklistSelectionIndex])
			}
		// filtering chapters
		} else if (this.state.chapters) {
			if (keyEventName == "ArrowUp") {
				if (chapterlistSelectionIndex > 4 ) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex - 5 })
				} else {
					this.setState({ chapterlistSelectionIndex: 0 })
				}
			}
			if (keyEventName == "ArrowDown") {
				if (chapterlistSelectionIndex < books[bookMap[selectedBook]].chapters.length - 6) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex + 5 })
				} else {
					this.setState({ chapterlistSelectionIndex: books[bookMap[selectedBook]].chapters.length - 1 })
				}
			}
			if (keyEventName == "ArrowLeft") {
				if (chapterlistSelectionIndex > 0 ) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex - 1 })
				} else {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex + 4 })
				}
			}
			if (keyEventName == "ArrowRight") {
				if (chapterlistSelectionIndex < books[bookMap[selectedBook]].chapters.length - 1) {
					this.setState({ chapterlistSelectionIndex: chapterlistSelectionIndex + 1 })
				} else {
					this.setState({ chapterlistSelectionIndex: 0 })
				}
			}
			if (keyEventName == "Enter") {

				// // let's get the chapter info from the input value
				// let chapterSplit = inputValue.split(' ')
				// let chapterNum = parseInt(chapterSplit[chapterSplit.length - 1])
				// let chapIndex = Object.keys(books[bookMap[selectedBook]].chapters)[chapterNum - 1]
				console.log(chapterlistSelectionIndex)
				console.log(books[bookMap[selectedBook]].chapters)
				let chapIndex = Object.keys(books[bookMap[selectedBook]].chapters)[chapterlistSelectionIndex]
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
		this.setState({
			dropdown: !this.state.dropdown,
			books: books,
			chapters: books[bookMap[selectedBook]].chapters
		})
	}

	onBlur() {
		const { books, chapter, bookMap } = this.props
		// this.setState({
		// 	dropdown: false,
		// 	books: books,
		// 	chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters
		// })
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
			listErrorAlert
		} = this.state

		let hide = (dropdown) ? '' : 'hide'

		return (
			<div className={`chapter-picker-container`}>
				<Label input={inputValue}
					onClick={::this.handleDropDownClick}
					onChange={::this.handleLabelChange}
					onKeyUp={::this.handleLabelKeyUp}
					onBlur={::this.onBlur}
				/>
				<div className={`modal ${hide}`}>
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