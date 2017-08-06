import React, { PropTypes } from 'react'

function Card(props) {
	const {
    children,
		customClass,
		extension,
  } = props

	return (
		<div className='card-container'>
			<div
				{...props}
				className={`card ${customClass}`}
			>
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
	customClass: null,
	extension: null,
}

export default Card
