import React, { PropTypes } from 'react'
import Placeholder from './buildingBlocks/Placeholder'
import PlaceholderShape from './buildingBlocks/PlaceholderShape'
import PlaceholderText from './buildingBlocks/PlaceholderText'
import PLACEHOLDER_ANIMATIONS from './buildingBlocks/PLACEHOLDER_ANIMATIONS'

function MediaListItemPlaceholder(props) {
	const {
    height,
    width,
    duplicate,
    borderRadius,
    widthRange,
    lineSpacing,
    textHeight,
    style,
    animation,
    className,
  } = props

	return (
		<Placeholder
			key='media-list-item-placeholder'
			height={height}
			duplicate={duplicate}
			className={className}
			animation={animation}
			style={style}
		>
			<PlaceholderShape
				borderRadius={borderRadius}
				width={width}
				height={height}
			/>
			<PlaceholderText
				className='flex'
				lineSpacing={lineSpacing}
				textHeight={textHeight}
				widthRange={widthRange}
				height={height}
			/>
		</Placeholder>
	)
}

MediaListItemPlaceholder.propTypes = {
	style: PropTypes.object,
	height: PropTypes.string,
	width: PropTypes.string,
	duplicate: PropTypes.number,
	borderRadius: PropTypes.string,
	className: PropTypes.string,
	widthRange: PropTypes.array,
	lineSpacing: PropTypes.string,
	textHeight: PropTypes.string,
	animation: PropTypes.oneOf(PLACEHOLDER_ANIMATIONS),
}

MediaListItemPlaceholder.defaultProps = {
	duplicate: 0,
	className: '',
	style: { margin: '20px 20px' },
	borderRadius: '5px',
	width: '80px',
	height: '80px',
	lineSpacing: '30px',
	textHeight: '12px',
	widthRange: [50, 100],
	animation: 'shimmer',
}

export default MediaListItemPlaceholder
