import React, { Component } from 'react'

class DropDownArrow extends Component {
	render() {
		const width = this.props.width || 40
		const height = this.props.height || 40
		const fill = this.props.fill || 'grey'
		const dir = this.props.dir || 'down'
		const rotation = (dir == 'down') ? 0 : 180

		let classes = `dropdown-arrow`

    return (
    	<div className={classes} onmouseover="">
      	<svg width={width} height={height} viewBox="189 13 12 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
			    <polygon stroke="none" fill={fill} fill-rule="evenodd" transform={`translate(195.000000, 17.000000) rotate(${rotation}) translate(-195.000000, -17.000000)`} points="189 14 195 20 201 14"></polygon>
				</svg>
      </div>
    );
  }
}

export default DropDownArrow
