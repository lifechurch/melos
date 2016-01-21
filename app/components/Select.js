import React, { Component, PropTypes } from 'react'

class Select extends Component {
	render() {
		return (
			<input {...this.props} />
			// type="text" 
			// className='large' 
			// placeholder="Event Name" 
			// name='title' 
			// onChange={handleChange} 
			// value={event.item.title}
		)
	}
}

Select.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}

export default Select