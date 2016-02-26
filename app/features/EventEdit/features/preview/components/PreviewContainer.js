import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import PreviewFeed from './PreviewFeed'
import PreviewSidebar from './PreviewSidebar'

class PreviewContainer extends Component {

	render() {
		return (
			<Row id='preview-container'>
				<Column s='medium-6'>
					<PreviewFeed {...this.props} />
				</Column>
				<Column s='medium-6'>
					<PreviewSidebar {...this.props} />
				</Column>
			</Row>
		)
	}

}

PreviewContainer.propTypes = {

}

export default PreviewContainer
