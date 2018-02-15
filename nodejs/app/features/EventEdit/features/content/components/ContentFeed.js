import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ContentTypeContainer from './ContentTypeContainer'
import ContentDraggable from './ContentDraggable'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { FormattedMessage } from 'react-intl'
import CheckImage from '../../../../../../images/check.png'
import ReorderImage from '../../../../../../images/reorder.png'

class ContentFeed extends Component {

	render() {
		const { dispatch, event, references, plans, _content, handleUpdate, handleChange, handleRemove, handleMove, handleStartReorder, handleReorder, intl } = this.props
		const { content } = event.item

		const contentList = content.map((c, i) => {
			const key = c.temp_content_id || c.content_id
			if (event.isReordering) {
				return (
					<ContentDraggable
						key={key}
						event={event}
						handleMove={handleMove}
						content={c}
						contentIndex={i}
						intl={intl}
					/>
				)
			} else {
				return (
					<ContentTypeContainer
						key={key}
						dispatch={dispatch}
						event={event}
						references={references}
						plans={plans}
						handleChange={handleChange}
						handleUpdate={handleUpdate}
						handleRemove={handleRemove}
						handleMove={handleMove}
						content={c}
						_content={_content}
						contentIndex={i}
						intl={intl}
					/>
				)
			}
		})

		let reorderButton = null
		if (event.isReordering) {
			reorderButton = (<a disabled={!event.rules.content.canReorder} onClick={handleReorder} className='solid-button blue'><img src={CheckImage} /> &nbsp;<FormattedMessage id="features.EventEdit.features.content.components.ContentFeed.doneReordering" /></a>)
		} else {
			reorderButton = (<a disabled={!event.rules.content.canReorder} onClick={handleStartReorder}><img className='reorder-icon' src={ReorderImage} /> <FormattedMessage id="features.EventEdit.features.content.components.ContentFeed.reorder" /></a>)
		}

		return (
			<div className='content-feed'>
				<Row>
					<div className='medium-2 large-3 columns'>
						{reorderButton}
					</div>
					<div className='medium-8 large-6 columns end'>
						<div>
							{contentList}
						</div>
					</div>
				</Row>
			</div>
		)
	}

}

ContentFeed.propTypes = {

}

export default DragDropContext(HTML5Backend)(ContentFeed)
