import React, { PropTypes } from 'react'
import Card from './Card'

function Inbox(props) {
	const { heading, className, children } = props

	return (
		<div className={`inbox-wrapper ${className}`}>
			<div className='inbox-heading'>
				{ heading }
			</div>
			<div className='inbox-content'>
				<Card>
					{ children }
				</Card>
			</div>
		</div>
	)
}

Inbox.propTypes = {
	heading: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	className: PropTypes.string,
	children: PropTypes.node,
}

Inbox.defaultProps = {
	heading: null,
	className: '',
	children: null,
}

export default Inbox
