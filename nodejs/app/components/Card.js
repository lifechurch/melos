import React from 'react'
import PropTypes from 'prop-types'

function Card(props) {
	const {
    children,
		customClass,
		extension,
  } = props

	return (
		<div className='card-container'>
			<div className={`card ${customClass}`}>
				{ children }
			</div>
			{
				extension &&
					<div className='card-extension'>
						{ extension }
					</div>
			}
		</div>
	)
}

Card.propTypes = {
	children: PropTypes.node,
	customClass: PropTypes.string,
	extension: PropTypes.node,
}

Card.defaultProps = {
	children: '',
	customClass: '',
	extension: null,
}

export default Card
