import React, { Component, PropTypes } from 'react'

class Books extends Component {

	constructor(props) {
		super(props)
		this.state = { selectedBook: this.props.initialSelection || null }
	}

	bookSelect(book) {
		this.setState( { selectedBook: book.usfm } )
		this.props.clickHandler(book)
	}

	render() {
		const { bookList, clickHandler } = this.props

		var books = bookList.map((book) => {
			return (<li key={book.usfm} className={ (book.usfm == this.state.selectedBook) ? 'active' : ''} onClick={this.bookSelect.bind(this, book)}>{ book.human }</li>)
		})

		return (
			<ul>
				{ books }
			</ul>
		)
	}
}


/**
 * 		bookList					  	{ array of book objects for the current version }
 * 		clickHandler			  	{ function to call when selecting book }
 * 		initialSelection	   	{ usfm for highlighting currently selected book }
 */
Books.propTypes = {
	bookList: React.PropTypes.array.isRequired,
	clickHandler: React.PropTypes.func.isRequired,
	initialSelection: React.PropTypes.string
}

export default Books