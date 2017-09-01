import React, { PropTypes } from 'react'
import getRandomInt from '../../lib/getRandomInt'


function PlaceholderText(props) {
	const {
    fill,
    background,
    height,
    lineSpacing,
    textHeight,
    className,
  } = props

	const totalLines = Math.floor(
    parseInt(height, 10) / (parseInt(textHeight, 10))
  )

	const placeholder = []
	for (let i = 0; i < totalLines; i++) {
		const isEven = i % 2 === 0
		const lineWidth = getRandomInt(80, 100)
    // build the lines with the background color
    // and place mask divs after each line
		if (isEven) {
			placeholder.push(
				<div
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
					style={{
						height: `${parseInt(textHeight, 10)}px`,
						width: `${100 - lineWidth}%`,
						background: 'white',
					}}
					className='margin-left-auto'
				/>
      )
		}
	}

	return (
		<div
			className={[
				'placeholder-text',
				`${className}`,
				'vertical-center',
				'flex-wrap'
			].join(' ')}
			style={{ height, background }}
		>
			{ placeholder }
		</div>
	)
}

PlaceholderText.propTypes = {
	fill: PropTypes.string,
	className: PropTypes.string,
	background: PropTypes.string,
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	lineSpacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	textHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

PlaceholderText.defaultProps = {
	fill: 'white',
	background: null,
	height: '200px',
	width: '100%',
	lineSpacing: '10px',
	textHeight: '17px',
	className: '',
}

export default PlaceholderText
