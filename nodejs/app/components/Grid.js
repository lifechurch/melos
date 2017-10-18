import React, { PropTypes } from 'react'

const MAX_WIDTH = 12

function Grid(props) {
	const { smCols, medCols, lgCols, className, children } = props

	// mobile first approach, always fall back to small
	const lgRatio = MAX_WIDTH / (lgCols || medCols || smCols)
	const medRatio = MAX_WIDTH / (medCols || smCols)
	const smRatio = MAX_WIDTH / smCols

	return (
		<div className='yv-grid'>
			{
				React.Children.map(children, (child) => {
					if (child) {
						return (
							<div
								className={[
									'yv-col',
									`yv-small-${smRatio}`,
									`yv-medium-${medRatio}`,
									`yv-large-${lgRatio}`,
									className
								].join(' ')}
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
	smCols: PropTypes.number,
	medCols: PropTypes.number,
	lgCols: PropTypes.number,
	className: PropTypes.string,
	children: PropTypes.node,
}

Grid.defaultProps = {
	smCols: 1,
	medCols: null,
	lgCols: null,
	className: '',
	children: null,
}

export default Grid
