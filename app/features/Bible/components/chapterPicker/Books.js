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
		const { list, onSelect, listSelectionIndex, onMouseOver, focus } = this.props
		const { selectedBook } = this.state

		var books = null
		if (Array.isArray(list)) {
			books = list.map((book, index) =>  {
				let active = (book.usfm == selectedBook) ? 'active' : ''
				if (focus) {
					let focusClass = (index == listSelectionIndex) ? 'focus' : ''
					return(
						(<li key={book.usfm} className={`${active} ${focusClass}`} onClick={this.bookSelect.bind(this, book)} onMouseOver={onMouseOver.bind(this, "books", index)} >{ book.human }</li>)
					)
				} else {
					return(
						(<li key={book.usfm} className={`${active}`} onClick={this.bookSelect.bind(this, book)} >{ book.human }</li>)
					)
				}
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
 * 		@onMouseOver					function to call when hovering over book
 * 		@listSelectionIndex 	index for selecting list element with arrow keys
 * 		@focus								allow mouse over and key actions on list items
 */
Books.propTypes = {
	list: React.PropTypes.array.isRequired,
	onSelect: React.PropTypes.func,
	initialSelection: React.PropTypes.string,
	onMouseOver: React.PropTypes.func,
	listSelectionIndex: React.PropTypes.number,
	focus: React.PropTypes.bool
}

export default Books