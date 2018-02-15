import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import localizedLink from '@youversion/utils/lib/routes/localizedLink'
import Card from '../../../components/Card'

function LinkCard({ serverLanguageTag, versions, languages }) {
	return (
		<div className="yv-link-card">
			<div className="row">
				<div className="medium-10 large-6 medium-centered column">
					<Card>
						<ul className="green-links yv-card-links">
							<li><a target="_self" href={localizedLink('/versions', serverLanguageTag)}><FormattedHTMLMessage id="footer.versions" values={{ count: versions.toLocaleString() }} /></a></li>
							<li><a target="_self" href={localizedLink('/languages', serverLanguageTag)}><FormattedHTMLMessage id="footer.languages" values={{ count: languages.toLocaleString() }} /></a></li>
							<li><a target="_self" href="https://help.youversion.com"><FormattedMessage id="footer.help" /></a></li>
							<li><a target="_self" href={localizedLink('/features/events', serverLanguageTag)}><FormattedMessage id="footer.events" /></a></li>
							<li><a target="_self" href={localizedLink('/donate', serverLanguageTag)}><FormattedMessage id="footer.donate" /></a></li>
						</ul>
						<ul className="gray-links yv-card-links">
							<li><a target="_self" href="https://www.youversion.com/volunteer"><FormattedMessage id="footer.volunteer" /></a></li>
							<li><a target="_self" href={localizedLink('/about', serverLanguageTag)}><FormattedMessage id="footer.about" /></a></li>
							<li><a target="_self" href="https://www.youversion.com/jobs"><FormattedMessage id="footer.jobs" /></a></li>
							<li><a target="_self" href="http://blog.youversion.com"><FormattedMessage id="footer.blog" /></a></li>
							<li><a target="_self" href={localizedLink('/press', serverLanguageTag)}><FormattedMessage id="footer.press" /></a></li>
							<li><a target="_self" href={localizedLink('/privacy', serverLanguageTag)}><FormattedMessage id="footer.privacy" /></a></li>
							<li><a target="_self" href={localizedLink('/terms', serverLanguageTag)}><FormattedMessage id="footer.terms" /></a></li>
						</ul>
						<ul className="gray-links yv-card-links">
							<li><a target="_self" href="http://www.facebook.com/YouVersion">Facebook</a></li>
							<li><a target="_self" href="http://www.twitter.com/youversion">Twitter</a></li>
							<li><a target="_self" href="http://www.instagram.com/youversion">Instagram</a></li>
							<li><a target="_self" href="http://www.youtube.com/youversion">YouTube</a></li>
							<li><a target="_self" href="http://www.pinterest.com/youversion/">Pinterest</a></li>
						</ul>
					</Card>
				</div>
			</div>
		</div>
	)
}

LinkCard.propTypes = {
	serverLanguageTag: PropTypes.string,
	versions: PropTypes.number,
	languages: PropTypes.number
}

LinkCard.defaultProps = {
	serverLanguageTag: null,
	versions: 0,
	languages: 0
}

export default LinkCard