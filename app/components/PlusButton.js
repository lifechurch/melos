import React, { Component } from 'react'

class PlusButton extends Component {

	render() {

	const width = this.props.width || 17
	const height = this.props.height || 17
	const fill = this.props.fill || '#979797'

	let classes = 'plus-container'

	  return (
			<svg className='plus-button' viewBox="0 0 17 17" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
		  	<path stroke="none" fill="#FFFFFF" fill-rule="evenodd" d="M0,8.5 C0,13.1943592 3.80564078,17 8.5,17 C9.48971832,17 10.4399332,16.8308397 11.323309,16.5198549 C14.6298961,15.3557994 17,12.2046409 17,8.5 C17,3.80564078 13.1948608,0 8.5,0 C3.80564078,0 0,3.80564078 0,8.5 Z"></path>
		  	<path stroke="none" fill={fill} fill-rule="evenodd" d="M9,8 L9,4 L8,4 L8,8 L4,8 L4,9 L8,9 L8,13 L9,13 L9,9 L13,9 L13,8 L9,8Z"></path>
			</svg>
	  );
	}
}

export default PlusButton