import React, { Component, PropTypes } from 'react'

class Card extends Component {

	render() {

		return (
			<div className='card'>
				{ this.props.children }
			</div>
		)
	}
}

Card.propTypes = {

}

export default Card