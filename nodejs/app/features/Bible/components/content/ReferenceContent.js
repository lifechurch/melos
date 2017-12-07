import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import withReferenceData from '@youversion/api-redux/lib/endpoints/bible/hocs/withReference'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'


class ReferenceContent extends Component {

	render() {
		const { html, text, usfm, className, referenceTitle, showTitle, renderText } = this.props
		return (
			<div className={className}>
				{ showTitle && referenceTitle && <Heading3>{ referenceTitle }</Heading3> }
				{ /* eslint-disable react/no-danger */ }
				<div
					className='reader'
					style={{ color: 'black' }}
					dangerouslySetInnerHTML={{ __html: html && (renderText ? text : html) }}
				/>
			</div>
		)
	}
}

ReferenceContent.propTypes = {
	showTitle: PropTypes.bool,
	renderText: PropTypes.bool,
}

ReferenceContent.defaultProps = {
	showTitle: true,
	bible: null,
	serverLanguageTag: 'en',
	renderText: false,
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(withReferenceData(ReferenceContent)))
