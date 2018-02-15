import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import CopyToClipboard from 'react-copy-to-clipboard'


class ClickToCopy extends Component {
	constructor(props) {
		super(props)
		this.state = {
			copied: false
		}
	}

	render() {
		const { children, customClass, text } = this.props
		const { copied } = this.state

		return (
			<div>
				{
					copied
						&& (
							<div className='animate-away copied'>
								<FormattedMessage id='copied' />
							</div>
						)
				}
				<CopyToClipboard
					className={`pointer yv-text-ellipsis ${customClass}`}
					text={text}
				>
					<a
						tabIndex={0}
						onClick={() => {
							this.setState({ copied: true })
							setTimeout(() => {
								this.setState({ copied: false })
							}, 3000)
						}}
					>
						{ children }
					</a>
				</CopyToClipboard>
			</div>
		)
	}
}

ClickToCopy.propTypes = {
	text: PropTypes.string.isRequired,
	customClass: PropTypes.string,
	children: PropTypes.node,
}

ClickToCopy.defaultProps = {
	customClass: '',
	children: <div />,
}

export default ClickToCopy
