import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import withReferenceData from '@youversion/api-redux/lib/endpoints/bible/hocs/withReference'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'


function ReferenceContent(props) {
	const { html, text, className, referenceTitle, showTitle, renderText } = props
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

ReferenceContent.propTypes = {
	showTitle: PropTypes.bool,
	renderText: PropTypes.bool,
	html: PropTypes.string,
	text: PropTypes.string,
	referenceTitle: PropTypes.string,
	className: PropTypes.string,
}

ReferenceContent.defaultProps = {
	showTitle: true,
	bible: null,
	serverLanguageTag: 'en',
	renderText: false,
	html: null,
	text: null,
	referenceTitle: null,
	className: '',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(withReferenceData(ReferenceContent)))
