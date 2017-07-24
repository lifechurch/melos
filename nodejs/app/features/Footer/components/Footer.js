import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { getConfiguration } from '@youversion/api-redux/lib/endpoints/bible/reducer'
import YouVersion from '../../../components/YVLogo'

// import './Footer.less'

class Footer extends Component {
	constructor(props) {
		super(props)
		this.didScroll = false
		this.state = {
			state: 'hidden',
			lastScrollTop: 0
		}
	}

	componentDidMount() {
		window.addEventListener('scroll', () => {
			this.didScroll = true
		})

		setInterval(() => {
			if (this.didScroll) {
				this.didScroll = false
				this.handleScroll()
			}
		}, 250)
	}

	handleScroll = () => {
		const { lastScrollTop } = this.state
		const scrollTop = (window.pageYOffset || document.documentElement.scrollTop)
		let state
		if (lastScrollTop < scrollTop) {
			// scroll down
			state = 'fixed'
		} else {
			// scroll up
			state = 'hidden'
		}

		this.setState(() => {
			return {
				state,
				lastScrollTop: scrollTop
			}
		})
	}

	render() {
		const { serverLanguageTag, bibleConfiguration } = this.props
		const { state } = this.state
		const {
			response: {
				totals: {
					versions,
					languages
				}
			}
		} = bibleConfiguration

		return (
			<div className="yv-footer">
				<div className={`yv-footer-wrapper yv-footer-${state}`}>
					<div className="left">
						<YouVersion width={100} height={14} />
					</div>
					<div className="center">
						<ul className="green-links">
							<li><a href="#">Events</a></li>
							<li><a href="#">Versions ({versions.toLocaleString()})</a></li>
							<li><a href="#">Languages ({languages.toLocaleString()})</a></li>
							<li><a href="#">Help</a></li>
							<li><a href="#">Social</a></li>
							<li><a href="#">Donate</a></li>
						</ul>
						<ul className="gray-links">
							<li><a href="#">About Us</a></li>
							<li><a href="#">Jobs</a></li>
							<li><a href="#">Blog</a></li>
							<li><a href="#">Press</a></li>
							<li><a href="#">Privacy Policy</a></li>
							<li><a href="#">Terms</a></li>
						</ul>
					</div>
					<div className="right">
						<img className="bible-icon" src={`/assets/icons/bible/58/${serverLanguageTag}.png`} />
					</div>
				</div>
			</div>
		)
	}
}

Footer.propTypes = {
	serverLanguageTag: PropTypes.string,
	bibleConfiguration: PropTypes.object
}

Footer.defaultProps = {
	serverLanguageTag: 'en',
	bibleConfiguration: {}
}

function mapStateToProps(state) {
	return {
		bibleConfiguration: getConfiguration(state),
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(Footer)
