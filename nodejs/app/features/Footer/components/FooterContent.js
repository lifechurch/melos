import React, { PropTypes, Component } from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
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
import StickyHeader from '../../../components/StickyHeader'
import SectionedHeading from '../../../components/SectionedHeading'

class FooterContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			langSelectorOpen: false,
			linksOpen: false,
			socialOpen: false
		}
	}

	handleSocialClick = () => {
		this.setState((state) => {
			return { socialOpen: !state.socialOpen }
		})
	}

	handleSocialClose = () => {
		this.setState({ socialOpen: false })
	}

	render() {
		const {
			serverLanguageTag,
			locale,
			screenWidth,
			onLangClick: handleLangClick,
			onLinksClick: handleLinksClick,
			langSelectorOpen,
			linksOpen,
			versions,
			languages
		} = this.props

		const {
			socialOpen
		} = this.state

		const showLinks = (screenWidth >= 865)

		const langToggle = (
			<a tabIndex={0} className="yv-lang-toggle" target="_self" onClick={handleLangClick}>
				{locale.nativeName}
				<DropDownArrow fill="#DDDDDD" height={10} dir={langSelectorOpen ? 'up' : 'down' } />
			</a>
		)

		const linksToggle = (
			<a tabIndex={0} className="yv-link-toggle" target="_self" onClick={handleLinksClick}>
				<FormattedMessage id="Reader.header.more label" />
				<DropDownArrow fill="#DDDDDD" height={10} dir={linksOpen ? 'up' : 'down' } />
			</a>
		)

		const left = (
			<div>
				{showLinks && <YouVersion width={100} height={14} />}
				{!showLinks && langToggle}
				{!showLinks && linksToggle}
			</div>
		)

		const right = (
			<div>
				{showLinks && langToggle}
				<a target="_self" href={localizedLink('/app', serverLanguageTag)}><img alt="Bible App Icon" className="bible-icon first-icon" src={`/assets/icons/bible/58/${serverLanguageTag}.png`} /></a>
				<a target="_self" href={localizedLink('/kids', serverLanguageTag)}><img alt="Bible App for Kids Icon" className="bible-icon" src="/assets/BibleAppForKids-icon-48x48.png" /></a>
			</div>
		)

		const linkStyle = {}
		if (screenWidth < 896) {
			linkStyle.marginRight = 5
		}

		const links = (
			<div>
				<ul className="green-links">
					<li style={linkStyle}><a target="_self" href={localizedLink('/versions', serverLanguageTag)}><FormattedHTMLMessage id="footer.versions" values={{ count: versions.toLocaleString() }} /></a></li>
					<li style={linkStyle}><a target="_self" href={localizedLink('/languages', serverLanguageTag)}><FormattedHTMLMessage id="footer.languages" values={{ count: languages.toLocaleString() }} /></a></li>
					<li style={linkStyle}><a target="_self" href="https://help.youversion.com"><FormattedMessage id="footer.help" /></a></li>
					<li style={linkStyle}><a target="_self" href={localizedLink('/features/events', serverLanguageTag)}><FormattedMessage id="footer.events" /></a></li>
					<li style={linkStyle}>
						<a tabIndex={0} target="_self" className="yv-social-toggle" onClick={this.handleSocialClick}><FormattedMessage id="footer.social" /></a>
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
										<a tabIndex={0} className="yv-close-x" onClick={this.handleSocialClose}><XMark width={15} height={15} fill="#444444" /></a>
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
					<li style={linkStyle}><a target="_self" href={localizedLink('/donate', serverLanguageTag)}><FormattedMessage id="footer.donate" /></a></li>
				</ul>
				<ul className="gray-links">
					<li><a target="_self" href="https://www.youversion.com/volunteer"><FormattedMessage id="footer.volunteer" /></a></li>
					<li><a target="_self" href={localizedLink('/about', serverLanguageTag)}><FormattedMessage id="footer.about" /></a></li>
					<li><a target="_self" href="https://www.youversion.com/jobs"><FormattedMessage id="footer.jobs" /></a></li>
					<li><a target="_self" href="http://blog.youversion.com"><FormattedMessage id="footer.blog" /></a></li>
					<li><a target="_self" href={localizedLink('/press', serverLanguageTag)}><FormattedMessage id="footer.press" /></a></li>
					<li><a target="_self" href={localizedLink('/privacy', serverLanguageTag)}><FormattedMessage id="footer.privacy" /></a></li>
					<li><a target="_self" href={localizedLink('/terms', serverLanguageTag)}><FormattedMessage id="footer.terms" /></a></li>
				</ul>
			</div>
		)

		return (
			<StickyHeader className="yv-footer" pinTo="bottom">
				<SectionedHeading
					left={left}
					right={right}
				>
					{showLinks && links}
				</SectionedHeading>
			</StickyHeader>
		)
	}
}

FooterContent.propTypes = {
	serverLanguageTag: PropTypes.string,
	locale: PropTypes.object,
	screenWidth: PropTypes.number,
	onLangClick: PropTypes.func.isRequired,
	onLinksClick: PropTypes.func.isRequired,
	linksOpen: PropTypes.bool.isRequired,
	langSelectorOpen: PropTypes.bool.isRequired,
	versions: PropTypes.number,
	languages: PropTypes.number
}

FooterContent.defaultProps = {
	serverLanguageTag: 'en',
	auth: {},
	locale: {},
	screenWidth: 0,
	versions: 0,
	languages: 0
}

export default FooterContent