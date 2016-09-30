import React, { Component, PropTypes } from 'react'

class Books extends Component {

	constructor(props) {
		super(props)
		const { initialSelection } = props
		this.state = { selectedBook: initialSelection || null }
	}

	bookSelect(book) {
		this.setState( { selectedBook: book.usfm } )
		const { onSelect } = this.props
		if (typeof onSelect == 'function') {
			onSelect(book)
		}
	}

	render() {
		const { list, onSelect } = this.props
		const { selectedBook } = this.state

		var books = null
		if (Array.isArray(list)) {
			books = list.map((book) =>  {
				return( (<li key={book.usfm} className={ (book.usfm == selectedBook) ? 'active' : ''}><a onClick={this.bookSelect.bind(this, book)}>{ book.human }</a></li>) )
			})
		}

		return (
			<ul className='book-list'>
				{ books }
			</ul>
		)
	}
}


/**
 * 		@list					  			array of book objects for the current version
 * 		@onSelect			  			function to call when selecting book
 * 		@initialSelection	   	usfm for highlighting currently selected book
 */
Books.propTypes = {
	list: React.PropTypes.array.isRequired,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.string
}

export default Books