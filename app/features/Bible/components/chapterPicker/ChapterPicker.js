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
		console.log(chapter.reference.usfm)
		console.log(chapter.reference.version_id)
		this.state = {
			selectedBook: chapter.reference.usfm.split('.')[0],
			selectedChapter: chapter.reference.usfm,
			selectedVersion: chapter.reference.version_id,
			selectedLanguage: selectedLanguage,
			books: books,
			chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters,
			inputValue: chapter.reference.human,
			listSelectionIndex: 0,
			dropdown: false,
			classes: 'hide-chaps',
			dbReady: false,
			db: null,
			results: []
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
		this.setState({ selectedBook: selectedBook.usfm, inputValue: `${selectedBook.human} `, chapters: books[bookMap[selectedBook.usfm]].chapters, books: null, dropdown: true, listSelectionIndex: 0 })
		console.log('booksstate', this.state)
		this.toggleChapterPickerList()
	}

	getChapter(selectedChapter) {
		const { dispatch, chapter } = this.props
		console.log(selectedChapter)
		this.setState({ selectedChapter: selectedChapter.usfm, inputValue: `${this.state.inputValue} ${selectedChapter.human}`, dropdown: false })
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

	handleLabelChange(changeEventValue) {
		const filter = changeEventValue;
		this.setState({ inputValue: changeEventValue })
		const instance = this
		console.time("Filter Items")
		const results = Filter.filter("BooksStore", filter.trim())
		console.timeEnd("Filter Items")
		console.log(results)
		// if the input already matches a book exactly, let's filter chapters
		if (results.length > 0 && `${results[0].human} ` == filter) {
			console.log('perfect match!')
			this.getBook(results[0])
			// this.setState({ books: null, chapters: results[0].chapters, selectedBook: results[0].usfm })
			// const chapterresults = Filter.filter("ChaptersStore", filter)
		} else if (false) {
			// keep the chapters modal open while typing for chapters

		} else {
			this.setState({ books: results, chapters: null, dropdown: true })
		}
		// instance.setState({ results })
	}

	handleLabelKeyUp(keyEvent) {
		const { books, bookMap } = this.props
		const { inputValue, listSelectionIndex, chapters, selectedBook } = this.state

		if (keyEvent == "ArrowUp") {
			if (listSelectionIndex > 0 ) {
				this.setState({ listSelectionIndex: listSelectionIndex - 1 })
			} else {
				this.setState({ listSelectionIndex: books.length - 1 })
			}
		}
		if (keyEvent == "ArrowDown") {
			if (listSelectionIndex < books.length - 1) {
				this.setState({ listSelectionIndex: listSelectionIndex + 1 })
			} else {
				this.setState({ listSelectionIndex: 0 })
			}
		}
		if (keyEvent == "Enter" || keyEvent == "ArrowRight") {
			const instance = this
			console.time("Filter Items")
			const results = Filter.filter("BooksStore", inputValue)
			console.timeEnd("Filter Items")
			console.log(results)
			// if the input already matches a book exactly, let's filter chapters
			if (results.length > 0) {
				this.getBook(results[listSelectionIndex])
				// this.setState({ books: null, chapters: results[0].chapters, selectedBook: results[0].usfm })
				// const chapterresults = Filter.filter("ChaptersStore", filter)
			} else {
				let chapterSplit = inputValue.split(' ')
				let chapterNum = parseInt(chapterSplit[chapterSplit.length - 1])
				let chapIndex = Object.keys(books[bookMap[selectedBook]].chapters)[chapterNum - 1]

				if (chapIndex !== undefined) {
					this.getChapter(books[bookMap[selectedBook]].chapters[chapIndex])
				} else {
					alert('cmon guy-o')
				}
			}
		}
	}

	handleListHover(index) {
		this.setState({ listSelectionIndex: index })
	}

	handleDropDownClick() {
		const { books, chapter, bookMap } = this.props
		const { selectedBook } = this.state
		this.setState({ dropdown: !this.state.dropdown, books: books, chapters: books[bookMap[selectedBook]].chapters})
	}

	onBlur() {
		const { books, chapter, bookMap } = this.props
		this.setState({ dropdown: false, books: books, chapters: books[bookMap[chapter.reference.usfm.split('.')[0]]].chapters })
	}


	render() {
		const { bookMap, chapter } = this.props
		const { books, chapters, dropdown, inputValue, classes, selectedBook, selectedChapter, selectedLanguage, selectedVersion, listSelectionIndex } = this.state

		let hide = (dropdown) ? '' : 'hide'

		// let chapterPickerModal = null
		// if ((Array.isArray(books) && bookMap) || chapters.length > 0) {

		let	chapterPickerModal = <ChapterPickerModal classes={classes} bookList={books} chapterList={chapters} selectedBook={selectedBook} selectedChapter={selectedChapter} getChapter={::this.getChapter} getBook={::this.getBook} toggle={::this.toggleChapterPickerList} listSelectionIndex={listSelectionIndex} onMouseOver={::this.handleListHover}/>
		// }
		console.log('render!', inputValue)
		return (
			<div className={`chapter-picker-container`}>
				<Label input={inputValue} onClick={::this.handleDropDownClick} onChange={::this.handleLabelChange} onKeyUp={::this.handleLabelKeyUp} onBlur={::this.onBlur}/>
				<div className={`modal ${hide}`}>
					{ chapterPickerModal }
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