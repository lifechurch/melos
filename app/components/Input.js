import React, { Component, PropTypes } from 'react'

class Input extends Component {
	render() {
		const { size } = this.props
		return (
			<input type='text' className={size} {...this.props} />
			// type="text" 
			// className='large' 
			// placeholder="Event Name" 
			// name='title' 
			// onChange={handleChange} 
			// value={event.item.title}
		)
	}
}

Input.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	placeholder: PropTypes.string,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}

export default Input