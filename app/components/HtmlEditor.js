import React, { Component, PropTypes } from 'react'
import ReactQuill from 'react-quill'

class HtmlEditor extends Component {
	render() {
		return (
			<ReactQuill {...this.props} />
		)
	}
}

HtmlEditor.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}

export default HtmlEditor