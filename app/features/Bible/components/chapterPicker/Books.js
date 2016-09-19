import React, { Component, PropTypes } from 'react'

class Books extends Component {

	render() {
		const { bookList, clickHandler } = this.props

		var books = bookList.map((book, index) => {
			return ()
		})

		return (

		)
	}
}

Books.propTypes = {

}

export default Books