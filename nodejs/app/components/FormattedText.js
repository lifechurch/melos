import React, { PropTypes } from 'react'

function FormattedText({ text, customClass }) {

	// create line breaks for new line characters
	const formattedText = text.replace(/(?:\r\n|\r|\n)/g, '<br />')

  /* eslint-disable react/no-danger */
	return (
		<div
			className={customClass}
			dangerouslySetInnerHTML={{ __html: formattedText }}
		/>
	)
}

FormattedText.propTypes = {
	text: PropTypes.string.isRequired,
	customClass: PropTypes.string,
}

FormattedText.defaultProps = {
	customClass: '',
}

export default FormattedText
