import React, { PropTypes, Component } from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { connect } from 'react-redux'
import { getConfiguration } from '@youversion/api-redux/lib/endpoints/bible/reducer'
import YouVersion from '../../../components/YVLogo'
import DropdownTransition from '../../../components/DropdownTransition'
import Card from '../../../components/Card'
import FacebookLogo from '../../../components/FacebookLogo'
import TwitterLogo from '../../../components/TwitterLogo'
import InstagramLogo from '../../../components/InstagramLogo'
import YouTubeLogo from '../../../components/YouTubeLogo'
import PinterestLogo from '../../../components/PinterestLogo'
import DropDownArrow from '../../../components/DropDownArrow'
import XMark from '../../../components/XMark'
import { localizedLink } from '../../../lib/routeUtils'
import LangSelector from './LangSelector'

class Footer extends Component {
	constructor(props) {
		super(props)
		this.didScroll = false
		this.state = {
			state: 'fixed',
			lastScrollTop: 0,
			langSelectorOpen: false,
			socialOpen: false
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

	handleLangClick = () => {
		this.setState((state) => {
			return { langSelectorOpen: !state.langSelectorOpen }
		})
	}

	handleSocialClick = () => {
		this.setState((state) => {
			return { socialOpen: !state.socialOpen }
		})
	}

	handleLangClose = () => {
		this.setState({ langSelectorOpen: false })
	}

	handleSocialClose = () => {
		this.setState({ socialOpen: false })
	}

	handleScroll = () => {
		const { lastScrollTop } = this.state
		const scrollTop = (window.pageYOffset || document.documentElement.scrollTop)
		const atBottom = ((window.innerHeight + Math.ceil(window.pageYOffset + 1)) >= document.body.scrollHeight - 105)
		let state
		if (atBottom) {
			state = 'fixed'
		} else if (lastScrollTop < scrollTop) {
			// scroll down
			state = 'hidden'
			this.handleSocialClose()
		} else {
			// scroll up
			state = 'fixed'
		}

		this.setState(() => {
			return {
				state,
				lastScrollTop: scrollTop
			}
		})
	}

	render() {
		const {
			serverLanguageTag,
			bibleConfiguration,
			locale
		} = this.props

		const {
			state,
			langSelectorOpen,
			socialOpen
		} = this.state

		const {
			response: {
				totals: {
					versions,
					languages
				}
			}
		} = bibleConfiguration

		return (
			<div className="yv-faux-footer">
				<div className="yv-footer">
					<div className={`yv-footer-wrapper yv-footer-${state}`}>
						<div className="left">
							<YouVersion width={100} height={14} />
						</div>
						<div className="center">
							<ul className="green-links">
								<li><a target="_self" href={localizedLink('/versions', serverLanguageTag)}><FormattedHTMLMessage id="footer.versions" values={{ count: versions.toLocaleString() }} /></a></li>
								<li><a target="_self" href={localizedLink('/languages', serverLanguageTag)}><FormattedHTMLMessage id="footer.languages" values={{ count: languages.toLocaleString() }} /></a></li>
								<li className="show-for-medium-down" style={{ width: '100%', height: 0 }}>&nbsp;</li>
								<li><a target="_self" href="https://help.youversion.com"><FormattedMessage id="footer.help" /></a></li>
								<li><a target="_self" href={localizedLink('/features/events', serverLanguageTag)}><FormattedMessage id="footer.events" /></a></li>
								<li>
									<a target="_self" className="yv-social-toggle" onClick={this.handleSocialClick}><FormattedMessage id="footer.social" /></a>
									<div className="yv-popup-modal-container">
										<DropdownTransition
											show={socialOpen}
											hideDir="down"
											transition={true}
											onOutsideClick={this.handleSocialClose}
											exemptClass="yv-social-toggle"
											classes="yv-popup-modal-content"
										>
											<Card>
												<div className="yv-social-card">
													<a className="yv-close-x" onClick={this.handleSocialClose}><XMark width={15} height={15} fill="#444444" /></a>
													<a target="_self" href="http://www.facebook.com/YouVersion"><FacebookLogo height={20} />Facebook</a>
													<a target="_self" href="http://www.twitter.com/youversion"><TwitterLogo height={20} />Twitter</a>
													<a target="_self" href="http://www.instagram.com/youversion"><InstagramLogo height={20} />Instagram</a>
													<a target="_self" href="http://www.youtube.com/youversion"><YouTubeLogo height={20} />YouTube</a>
													<a target="_self" href="http://www.pinterest.com/youversion/"><PinterestLogo height={20} />Pinterest</a>
												</div>
											</Card>
										</DropdownTransition>
									</div>
								</li>
								<li><a target="_self" href={localizedLink('/donate', serverLanguageTag)}><FormattedMessage id="footer.donate" /></a></li>
							</ul>
							<ul className="gray-links">
								<li><a target="_self" href={localizedLink('/about', serverLanguageTag)}><FormattedMessage id="footer.about" /></a></li>
								<li><a target="_self" href="https://www.youversion.com/jobs"><FormattedMessage id="footer.jobs" /></a></li>
								<li><a target="_self" href="http://blog.youversion.com"><FormattedMessage id="footer.blog" /></a></li>
								<li><a target="_self" href={localizedLink('/press', serverLanguageTag)}><FormattedMessage id="footer.press" /></a></li>
								<li><a target="_self" href={localizedLink('/privacy', serverLanguageTag)}><FormattedMessage id="footer.privacy" /></a></li>
								<li><a target="_self" href={localizedLink('/terms', serverLanguageTag)}><FormattedMessage id="footer.terms" /></a></li>
							</ul>
						</div>
						<div className="right">
							<a className="yv-lang-toggle" target="_self" onClick={this.handleLangClick}>
								{locale.nativeName}
								&nbsp;
								<DropDownArrow height={10} dir={langSelectorOpen ? 'up' : 'down' } />
							</a>
							<div className="show-for-medium-down" style={{ width: '100%' }} />

							<a target="_self" href={localizedLink('/app', serverLanguageTag)}><img className="bible-icon first-icon" src={`/assets/icons/bible/58/${serverLanguageTag}.png`} /></a>
							&nbsp;
							<a target="_self" href={localizedLink('/kids', serverLanguageTag)}><img className="bible-icon" src="/assets/BibleAppForKids-icon-48x48.png" /></a>
						</div>
					</div>
					<div className="yv-fullscreen-modal-container">
						<DropdownTransition
							show={langSelectorOpen}
							hideDir="down"
							transition={true}
							onOutsideClick={this.handleLangClose}
							exemptClass="yv-lang-toggle"
							classes="yv-fullscreen-modal-content"
						>
							<a className="yv-close-x" onClick={this.handleLangClose}><XMark width={15} height={15} fill="#444444" /></a>
							<LangSelector {...this.props} />
						</DropdownTransition>
					</div>
				</div>
			</div>
		)
	}
}

Footer.propTypes = {
	serverLanguageTag: PropTypes.string,
	bibleConfiguration: PropTypes.object,
	auth: PropTypes.object,
	locale: PropTypes.object
}

Footer.defaultProps = {
	serverLanguageTag: 'en',
	bibleConfiguration: {},
	auth: {},
	locale: {}
}

function mapStateToProps(state) {
	return {
		bibleConfiguration: getConfiguration(state),
		serverLanguageTag: state.serverLanguageTag,
		auth: state.auth,
		locale: state.locale
	}
}

export default connect(mapStateToProps, null)(Footer)
