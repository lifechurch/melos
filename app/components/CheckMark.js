import React, { Component } from 'react'


class CheckMark extends Component {

    render() {

		const width = this.props.width || 15
		const height = this.props.height || 15
		const fill = this.props.fill || '#4EAE50'
		const dir = this.props.dir || 'right'

		const rotation = (dir == 'right') ? 0 : 180
		var classes = `checkmark-container`

        return (
            <div {...this.props} className={classes} onmouseover="">
                <svg className={`checkmark-${dir}`} viewBox="3 9 8 6" width={width} height={height} version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                    <polygon transform={`rotate(${rotation})`} stroke="none" fill={fill} fill-rule="evenodd" points="9.59694776 9.13920942 5.9208144 12.4484412 4.53882817 11.3293834 3.83596446 12.0390452 5.40475625 14.0128512 5.9208144 14.6638476 6.49497595 14.0128512 10.2323365 9.78011287 9.59694776 9.13920942 9.59694776 9.13920942"></polygon>
                </svg>
            </div>
        );
    }
}

export default CheckMark
