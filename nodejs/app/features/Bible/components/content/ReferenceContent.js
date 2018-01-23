import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import withReferenceData from '@youversion/api-redux/lib/endpoints/bible/hocs/withReference'
import Heading3 from '@youversion/melos/dist/components/typography/Heading3'
import Link from '@youversion/melos/dist/components/links/Link'
import Placeholder from '../../../../components/placeholders/buildingBlocks/Placeholder'
import PlaceholderText from '../../../../components/placeholders/buildingBlocks/PlaceholderText'


function ReferenceContent(props) {
	const {
		html,
		text,
		className,
		titleWithAbbr,
		showTitle,
		renderText,
		renderLink,
		referenceLink
	} = props

	let heading = (
		<div style={{ marginBottom: '10px' }}>
			<Heading3>
				{ titleWithAbbr }
			</Heading3>
		</div>
	)
	let content = (
		/* eslint-disable react/no-danger */
		<div
			className='reader'
			style={{ color: 'black' }}
			dangerouslySetInnerHTML={{ __html: html && (renderText ? text : html) }}
		/>
	)
	if (renderLink) {
		heading = (
			<Link to={referenceLink}>
				{ heading }
			</Link>
		)
		content = (
			<Link to={referenceLink}>
				{ content }
			</Link>
		)
	}

	return (
		<div className={className}>
			{
				showTitle
					&& titleWithAbbr
					&& heading
			}
			{
				html
					? content
					: (
						<Placeholder height='110px'>
							<PlaceholderText
								className='flex'
								lineSpacing='15px'
								textHeight='16px'
								widthRange={[20, 100]}
							/>
						</Placeholder>
					)
			}
		</div>
	)
}

ReferenceContent.propTypes = {
	showTitle: PropTypes.bool,
	renderText: PropTypes.bool,
	html: PropTypes.string,
	text: PropTypes.string,
	titleWithAbbr: PropTypes.string,
	className: PropTypes.string,
	renderLink: PropTypes.bool,
	referenceLink: PropTypes.string.isRequired,
}

ReferenceContent.defaultProps = {
	showTitle: true,
	bible: null,
	serverLanguageTag: 'en',
	renderText: false,
	html: null,
	text: null,
	titleWithAbbr: null,
	className: '',
	renderLink: true,
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(withReferenceData(ReferenceContent)))
