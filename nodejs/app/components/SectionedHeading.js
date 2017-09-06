import React, { PropTypes } from 'react'

function SectionedHeading(props) {
	const { classes, left, right, children } = props

	return (
		<div
			className={[
				'sectioned-heading',
				'vertical-center',
				'horizontal-center',
				'columns',
				'medium-8',
				'small-11',
				'small-centered',
				`${classes}`
			].join(' ')}
			style={{ marginBottom: '15px' }}
		>
			<div className='vertical-center' style={{ width: '66%' }}>
				{
					left &&
					<div
						className='absolute absolute-left'
						style={{ fontSize: '13.5px' }}
					>
						{ left }
					</div>
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
					<div
						className='absolute absolute-right'
						style={{ fontSize: '13.5px' }}
					>
						{ right }
					</div>
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
