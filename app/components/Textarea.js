import React, { Component, PropTypes } from 'react'

class Textarea extends Component {
	render() {
		return (
			<textarea {...this.props}></textarea>
		)
	}
}

Textarea.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}

export default Textarea