import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'
import RevManifest from '../../../../../../app/lib/revManifest'

const contentSource = {
	beginDrag(props) {
		return {
			...props
		}
	}
}

const contentTarget = {
	hover(props, monitor, component) {
		const { handleMove } = props
		const dragIndex = monitor.getItem().contentIndex
		const hoverIndex = props.contentIndex

		if (dragIndex === hoverIndex) {
			return
		}

		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top)  / 2
		const clientOffset = monitor.getClientOffset()
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		handleMove(dragIndex, hoverIndex)
		monitor.getItem().contentIndex = hoverIndex
	}
}

class ContentDraggable extends Component {
		render() {
			const { contentIndex, content, connectDragSource, connectDropTarget, isDragging } = this.props

			let style = {}
			if (isDragging) {
				style = {
					opacity: 0
				}
			}

			let previewText = ''
			switch(content.type) {
				case 'text':
					previewText = content.data.body.replace(/(<([^>]+)>)/ig,"").substr(0, 100)
					break;

				case 'announcement':
					previewText = content.data.title.substr(0, 100)
					break;

				case 'reference':
					previewText = content.data.human
					break;

				case 'plan':
					previewText = content.data.title
					break;

				case 'url':
					previewText = content.data.url
					break;

				case 'image':
					previewText = content.data.url
					break;
			}

			return connectDragSource(connectDropTarget(
				<div className='content-draggable' style={style}>
					<Row>
						<div className='medium-12'>
							<div className='sort'>
								{contentIndex + 1}
							</div>
							<div className='body'>
								<div className='type'>
									{content.type.toUpperCase()}
								</div>
								<div className='preview'>
									{previewText}
								</div>
								<img className='dragHandle' src={`/images/${RevManifest('reorder-gray.png')}`} />
							</div>
						</div>
					</Row>
				</div>
			))
		}
}

export default DropTarget('content', contentTarget, connect => ({
	connectDropTarget: connect.dropTarget()
}))(DragSource('content', contentSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging()
}))(ContentDraggable))
