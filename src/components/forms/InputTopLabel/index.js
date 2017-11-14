import React from 'react'
import PropTypes from 'prop-types'
import { Div, Label, Input as StyledInput } from 'glamorous'
import Heading3 from '../../typography/Heading3'
import withDebouncedInput from '../hocs/withDebouncedInput'

function InputTopLabel(props) {
  const {
		onChange: handleChange,
		onKeyUp: handleKeyUp,
		value,
		name,
		placeholder,
		type,
		debounce,
		label
	} = props


  return (
    <Div >
      <Label >
        <Heading3>{label}</Heading3>
      </Label>
      <StyledInput
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        value={value}
        name={name}
        placeholder={placeholder}
        type={type}
        debounce={debounce}
        border="none"
        borderBottom="solid 1px #777"
        outline="none"
        display="block"
        width="100%"
        fontSize={16}
        lineHeight="24px"
      />
    </Div>
  )
}

InputTopLabel.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onKeyUp: PropTypes.func,
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  type: PropTypes.oneOf(['text', 'password', 'search']),
  debounce: PropTypes.bool,
  label: PropTypes.string
}

InputTopLabel.defaultProps = {
  placeholder: '',
  value: '',
  name: 'input',
  type: 'text',
  onKeyUp: null,
  debounce: true,
  label: ''
}

export default withDebouncedInput(InputTopLabel)
