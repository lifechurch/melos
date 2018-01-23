import React, { PropTypes } from 'react'
import getRandomInt from '../../../lib/getRandomInt'


function PlaceholderText(props) {
	const {
    fill,
    background,
    height,
		widthRange,
    lineSpacing,
    textHeight,
  } = props

	const totalLines = Math.floor(
    parseInt(height, 10) / (parseInt(textHeight, 10) + parseInt(lineSpacing, 10))
  )
	const fillExtraSpace = parseInt(height, 10)
		% (parseInt(textHeight, 10) + parseInt(lineSpacing, 10))

	const placeholder = []
	for (let i = 0; i < (totalLines * 2); i++) {
		const isEven = (i % 2 === 0)
		const lineWidth = getRandomInt(widthRange[0], widthRange[1])
    // build the lines with the background color
    // and place mask divs after each line
		if (isEven) {
			placeholder.push(
				<div
					key={`text-${i}`}
					style={{
						height: `${parseInt(lineSpacing, 10)}px`,
						width: '100%',
						background: `${fill}`,
					}}
				/>
      )
		} else {
			placeholder.push(
				<div
					key={`text-${i}`}
					style={{
						height: `${parseInt(textHeight, 10)}px`,
						width: `${100 - lineWidth}%`,
						border: `1px solid ${fill}`,
						background: `${fill}`,
					}}
					className='margin-left-auto'
				/>
      )
		}
	}

	if (fillExtraSpace) {
		placeholder.push(
			<div
				key='text-fill'
				style={{
					height: `${parseInt(fillExtraSpace, 10)}px`,
					width: '100%',
					background: `${fill}`,
				}}
			/>
		)
	}

	return (
		<div
			className='placeholder-text'
			style={{ height, background, width: '100%' }}
		>
			{ placeholder }
		</div>
	)
}

PlaceholderText.propTypes = {
	fill: PropTypes.string,
	background: PropTypes.string,
	widthRange: PropTypes.array,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	lineSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	textHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

PlaceholderText.defaultProps = {
	fill: 'white',
	background: null,
	widthRange: [80, 100],
	lineSpacing: '6px',
	textHeight: '12px',
}

export default PlaceholderText
