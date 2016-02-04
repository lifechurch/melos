import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ContentTypeContainer from './ContentTypeContainer'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class ContentFeed extends Component {

	render() {
		const { event, plans, handleUpdate, handleChange, handleRemove } = this.props
		const { content } = event.item

		const contentList = content.map((c,i) => {
			const key = c.temp_content_id || c.content_id
			return (
				<ContentTypeContainer
					key={key}
					event={event}
					plans={plans}
					handleChange={handleChange}
					handleUpdate={handleUpdate}
					handleRemove={handleRemove}
					content={c}
					contentIndex={i} />
			)
		})

		return (
			<div className='content-feed'>
				<Row>
					<Column s='medium-12'>
						<ReactCSSTransitionGroup transitionName='content'>
							{contentList}
						</ReactCSSTransitionGroup>
					</Column>
				</Row>
			</div>
		)
	}

}

ContentFeed.propTypes = {

}

export default ContentFeed
