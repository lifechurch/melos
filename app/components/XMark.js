import React, { Component } from 'react'

class XMark extends Component {

    render() {

		const width = this.props.width || 8
		const height = this.props.height || 8
		const fill = this.props.fill || '#979797'

		let classes = 'xmark-container'

        return (
            <div {...this.props} className={classes} onmouseover="">
                <svg className='xmark' viewBox="67 8 8 8" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                    <polygon stroke="none" fill={fill} fill-rule="evenodd" points="74.0856176 9.4287633 71.5143809 12 74.0856176 14.5712367 73.5712367 15.0856176 71 12.5143809 68.4287633 15.0856176 67.9143824 14.5712367 70.4856191 12 67.9143824 9.4287633 68.4287633 8.91438245 71 11.4856191 73.5712367 8.91438245 74.0856176 9.4287633 74.0856176 9.4287633 74.0856176 9.4287633"></polygon>
                </svg>
            </div>
        );
    }
}

export default XMark
