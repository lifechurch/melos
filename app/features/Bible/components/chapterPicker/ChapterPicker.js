import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ActionCreators from '../../actions/creators'
import Filter from '../../../../lib/filter'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Books from './Books'
import Chapters from './Chapters'
import cookie from 'react-cookie';
import moment from 'moment'
import ChapterPickerModal from './ChapterPickerModal'
import Label from './Label'


class ChapterPicker extends Component {

	constructor(props) {
		super(props)
		const { bible } = props
		this.state = {
			selectedBook: bible.chapter.reference.usfm.split('.')[0],
			selectedChapter: bible.chapter.reference.usfm,
			selectedVersion: bible.chapter.reference.version_id,
			selectedLanguage: bible.versions.selectedLanguage,
			dropdown: false,
			classes: 'hide-chaps',
			dbReady: false,
			db: null,
			results: []
		}
		// props.dispatch(ActionCreators.loadVersionAndChapter({ id: 100, reference: 'MAT.1' }))
		// props.dispatch(ActionCreators.momentsColors())
	}



	getBook(book) {
		this.setState({ selectedBook: book.usfm })
		this.toggleChapterPickerList()
	}

	getChapter(chapter) {
		const { dispatch, bible } = this.props
		console.log(chapter)
		this.setState({ selectedChapter: chapter.usfm })
		this.toggleChapterPickerList()
		dispatch(ActionCreators.bibleChapter({ id: this.state.selectedVersion, reference: chapter.usfm }))
		// then write cookie for selected chapter
		cookie.save('last_read', chapter.usfm, { maxAge: moment().add(1, 'y').toDate(), path: '/' })
	}

	// this handles the class toggling for book and chapter clicks on mobile
	toggleChapterPickerList() {
		(this.state.classes) == 'hide-chaps' ? this.setState({ classes: 'hide-books' }) : this.setState({ classes: 'hide-chaps' })
	}

	handleLabelChange(changeEvent) {

	}

	handleLabelKeyUp(keyEvent) {

	}

	handleDropDownClick(value) {
		this.setState({ dropdown: value })
	}



	render() {
		const { bible } = this.props
		const { dropdown, selectedBook, selectedChapter, selectedLanguage, selectedVersion } = this.state

		let hide = (dropdown) ? '' : 'hide'

		if (dropdown && Array.isArray(bible.books.all) && bible.books.map) {
			chapterPicker = <ChapterPicker classes={this.state.classes} bookList={bible.books.all} chapterList={bible.books.all[bible.books.map[this.state.selectedBook]].chapters} selectedBook={this.state.selectedBook} selectedChapter={this.state.selectedChapter} getChapter={::this.getChapter} getBook={::this.getBook} toggle={::this.toggleChapterPickerList} />
		}

		return (
			<div className={`chapter-picker-container ${hide}`}>
				<Label input={selectedBook} onClick={::this.handleDropDownClick} />
				{ chapterPicker }
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
	chapters: React.PropTypes.object,
	selectedBook: React.PropTypes.string,
	selectedChapter: React.PropTypes.string,
	selectedLanguage: React.PropTypes.string
}

export default ChapterPicker