import React, { PropTypes } from 'react'

function SectionedHeading(props) {
	const { classes, left, right, children } = props

	return (
		<div
			className={
				`
					sectioned-header
					vertical-center
					horizontal-center
					columns
					medium-8
					small-11
					small-centered
					${classes}
				`
			}
			style={{ marginBottom: '15px' }}
		>
			<div className='vertical-center'>
				{
					left &&
					<div className='absolute absolute-left'>{ left }</div>
				}
				{
					children
					&& (
						<h4 className='center centered text-center'>
							{ children }
						</h4>
					)
				}
				{
					right &&
					<div className='absolute absolute-right'>{ right }</div>
				}
			</div>
		</div>
	)
}

SectionedHeading.propTypes = {
	classes: PropTypes.string,
	left: PropTypes.node,
	right: PropTypes.node,
	children: PropTypes.node.isRequired,
}

SectionedHeading.defaultProps = {
	classes: '',
	left: null,
	right: null,
}

export default SectionedHeading
