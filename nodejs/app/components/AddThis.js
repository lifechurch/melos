import React, { Component, PropTypes } from 'react'


class AddThis extends Component {
	componentDidMount() {
		if (typeof window !== 'undefined') {
			// Initialize AddThis, if Necessary
			const interval = setInterval(() => {
				if (typeof window !== 'undefined'
						&& window.addthis
						&& window.addthis.layers
						&& window.addthis.layers.refresh
				) {
					clearInterval(interval);
					window.addthis.layers.refresh()
				}
			}, 100);
		}
	}

	shouldComponentUpdate(nextProps) {
		const { title: nextTitle, text: nextText, url: nextUrl } = nextProps
		const { title, text, url } = this.props

		if (
			typeof window !== 'undefined' &&
			(text !== nextText || url !== nextUrl || title !== nextTitle)
		) {
			if (typeof window.addthis_share !== 'object') {
				window.addthis_share = {}
			}

			window.addthis.update('share', 'url', nextUrl)
			window.addthis.update('share', 'title', `${nextTitle || nextText}`)
			window.addthis.update('share', 'description', nextText)

			return true
		}

		return false
	}

	render() {
		const { className } = this.props

		return (
			<div className={className}>
				<div className='addthis_inline_share_toolbox_a0vl' />
			</div>
		)
	}
}

AddThis.propTypes = {
	title: PropTypes.string,
	text: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	className: PropTypes.string,
}

AddThis.defaultProps = {
	title: '',
	className: '',
}

export default AddThis
