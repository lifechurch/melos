import React, { PropTypes } from 'react'

function Grid(props) {
	const { children } = props

	return (
		<div className='yv-grid'>
			{
				React.Children.map(children, (child) => {
					if (child) {
						return (
							<div
								className='yv-col'
							>
								{ child }
							</div>
						)
					} else {
						return null
					}
				})
			}
		</div>
	)
}

Grid.propTypes = {

}

Grid.defaultProps = {

}

export default Grid
