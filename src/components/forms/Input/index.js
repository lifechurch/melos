import React from 'react'
import PropTypes from 'prop-types'
import { Input as StyledInput } from 'glamorous'
import withDebouncedInput from '../hocs/withDebouncedInput'

function Input(props) {
  const {
		onChange: handleChange,
		onKeyUp: handleKeyUp,
		value,
		customClass,
		size,
		name,
		placeholder,
		type,
		debounce
	} = props


  return (
    <StyledInput
      className={customClass || size}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      value={value}
      name={name}
      placeholder={placeholder}
      type={type}
      debounce={debounce}
    />
  )
}

Input.propTypes = {
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onKeyUp: PropTypes.func,
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  type: PropTypes.oneOf(['text', 'password', 'search']),
  customClass: PropTypes.string,
  debounce: PropTypes.bool
}

Input.defaultProps = {
  size: 'medium',
  placeholder: '',
  value: '',
  name: 'input',
  customClass: null,
  type: 'text',
  onKeyUp: null,
  debounce: true
}

export default withDebouncedInput(Input)
