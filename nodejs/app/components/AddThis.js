import React, { Component, PropTypes } from 'react'


class AddThis extends Component {
	componentDidMount() {
		this.initialize()
	}

	componentWillReceiveProps(nextProps) {
		const { title: nextTitle, text: nextText, url: nextUrl } = nextProps
		const { title, text, url } = this.props

		if (
			typeof window !== 'undefined' &&
			(text !== nextText || url !== nextUrl || title !== nextTitle)
		) {
			if (typeof window.addthis_share !== 'object') {
				window.addthis_share = {}
			}
			if (window.addthis) {
				window.addthis.update('share', 'url', nextUrl)
				window.addthis.update('share', 'title', `${nextTitle || nextText}`)
				window.addthis.update('share', 'description', nextText)
			} else {
				this.initialize()
			}
		}
	}

	initialize = () => {
		const { url, text, title } = this.props
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
					window.addthis.update('share', 'url', url)
					window.addthis.update('share', 'title', `${title || text}`)
					window.addthis.update('share', 'description', text)
				}
			}, 100);
		}
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
	text: PropTypes.string,
	url: PropTypes.string.isRequired,
	className: PropTypes.string,
}

AddThis.defaultProps = {
	title: null,
	text: null,
	className: '',
}

export default AddThis
