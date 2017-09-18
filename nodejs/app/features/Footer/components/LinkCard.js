import React, { PropTypes } from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { localizedLink } from '../../../lib/routeUtils'
import YouVersion from '../../../components/YVLogo'
import FacebookLogo from '../../../components/FacebookLogo'
import TwitterLogo from '../../../components/TwitterLogo'
import InstagramLogo from '../../../components/InstagramLogo'
import YouTubeLogo from '../../../components/YouTubeLogo'
import PinterestLogo from '../../../components/PinterestLogo'
import XMark from '../../../components/XMark'
import Card from '../../../components/Card'
import IconButtonGroup from '../../../components/IconButtonGroup'
import IconButton from '../../../components/IconButton'

function LinkCard({ serverLanguageTag, versions, languages }) {
	return (
		<div className="yv-link-card">
			<div className="row">
				<div className="medium-10 large-6 medium-centered column">
					<h2 className="title"><YouVersion height={14} width={100} /></h2>
					<Card>
						<IconButtonGroup iconHeight={20} iconSpacing={24} iconFill="#a2a2a2" iconActiveFill="#444444" verticalAlign="middle" horizontalAlign="center">
							<IconButton label="Facebook" to="http://www.facebook.com/YouVersion" useClientRouting={false}>
								<FacebookLogo />
							</IconButton>
							<IconButton label="Twitter" to="http://www.twitter.com/youversion" useClientRouting={false}>
								<TwitterLogo />
							</IconButton>
							<IconButton label="Instagram" to="http://www.instagram.com/youversion" useClientRouting={false}>
								<InstagramLogo />
							</IconButton>
							<IconButton label="YouTube" to="http://www.youtube.com/youversion" useClientRouting={false}>
								<YouTubeLogo />
							</IconButton>
							<IconButton label="Pinterest" to="http://www.pinterest.com/youversion/" useClientRouting={false}>
								<PinterestLogo />
							</IconButton>
						</IconButtonGroup>

						<ul className="green-links">
							<li><a target="_self" href={localizedLink('/versions', serverLanguageTag)}><FormattedHTMLMessage id="footer.versions" values={{ count: versions.toLocaleString() }} /></a></li>
							<li><a target="_self" href={localizedLink('/languages', serverLanguageTag)}><FormattedHTMLMessage id="footer.languages" values={{ count: languages.toLocaleString() }} /></a></li>
							<li><a target="_self" href="https://help.youversion.com"><FormattedMessage id="footer.help" /></a></li>
							<li><a target="_self" href={localizedLink('/features/events', serverLanguageTag)}><FormattedMessage id="footer.events" /></a></li>
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
					</Card>
				</div>
			</div>
		</div>
	)
}

LinkCard.propTypes = {

}

LinkCard.defaultProps = {

}

export default LinkCard
