import React, { PropTypes } from 'react'

function Card(props) {
	const {
    children,
		customClass,
		footer,
  } = props

	return (
		<div className='card-container'>
			<div
				{...props}
				className={`card ${customClass || ''}`}
			>
				{ children }
			</div>
			{
				footer &&
				<div className='card-footer'>
					{ footer }
				</div>
			}
		</div>
	)
}

Card.propTypes = {
	children: PropTypes.node,
	customClass: PropTypes.string,
	footer: PropTypes.node,
}

Card.defaultProps = {
	children: null,
	customClass: null,
	footer: null,
}

export default Card
