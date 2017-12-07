import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import withReferenceData from '@youversion/api-redux/lib/endpoints/bible/hocs/withReference'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'


class TopicView extends Component {

	render() {
		const { content, usfm, className, referenceTitle } = this.props
		return (
			<div className={className}>
				{ referenceTitle }
				{ /* eslint-disable react/no-danger */ }
				<div
					className='reader'
					style={{ color: 'black' }}
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			</div>
		)
	}
}

TopicView.propTypes = {
	moments: PropTypes.object,
	routeParams: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

TopicView.defaultProps = {
	moments: null,
	bible: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(withReferenceData(TopicView)))
