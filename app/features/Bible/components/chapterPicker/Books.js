import React, { Component, PropTypes } from 'react'

class Books extends Component {


	bookSelect(book, filtering) {
		const { onSelect } = this.props
		if (typeof onSelect == 'function') {
			onSelect(book, filtering)
		}
	}

	render() {
		const { list, onSelect, listSelectionIndex, onMouseOver, focus, initialSelection } = this.props

		var books = null
		if (Array.isArray(list) && list.length > 0) {
			books = list.map((book, index) =>  {
				if (book && book.usfm) {
					let active = (book.usfm == initialSelection) ? 'active' : ''
					if (focus) {
						let focusClass = (index == listSelectionIndex) ? 'focus' : ''
						return(
							(<li key={book.usfm} className={`${active} ${focusClass}`} onClick={this.bookSelect.bind(this, book, true)} onMouseOver={onMouseOver.bind(this, "books", index)} >{ book.human }</li>)
						)
					} else {
						return(
							(<li key={book.usfm} className={`${active}`} onClick={this.bookSelect.bind(this, book, false)} >{ book.human }</li>)
						)
					}
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