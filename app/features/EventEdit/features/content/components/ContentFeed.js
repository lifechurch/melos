import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import ContentTypeContainer from './ContentTypeContainer'

class ContentFeed extends Component {

	render() {
		const { event, handleUpdate, handleChange } = this.props
		const { content } = event.item

		const contentList = content.map((c,i) => {
			return (
				<ContentTypeContainer 
					handleChange={handleChange} 
					handleUpdate={handleUpdate} 
					content={c}
					contentIndex={i} />
			)
		})

		return (
			<div className='content-feed'>
				<Row>
					<Column s='medium-12'>
						{contentList}
					</Column>
				</Row>
			</div>
		)
	}

}

ContentFeed.propTypes = {

}

export default ContentFeed