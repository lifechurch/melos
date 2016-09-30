import React, { Component, PropTypes } from 'react'

class Books extends Component {

	constructor(props) {
		super(props)
		this.state = { selectedBook: props.initialSelection || null }
	}

	bookSelect(book) {
		this.setState( { selectedBook: book.usfm } )
		if (typeof this.props.onSelect == 'function') {
			this.props.onSelect(book)
		}
	}

	render() {
		const { list, onSelect } = this.props

		var books = null
		if (Array.isArray(list)) {
			books = list.map((book) =>  {
				return( (<li key={book.usfm} className={ (book.usfm == this.state.selectedBook) ? 'active' : '' } onClick={this.bookSelect.bind(this, book)}>{ book.human }</li>) )
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