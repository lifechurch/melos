import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { getConfiguration } from '@youversion/api-redux/lib/endpoints/bible/reducer'
import YouVersion from '../../../components/YVLogo'

// import './Footer.less'

function Footer({ serverLanguageTag, bibleConfiguration }) {
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
			<div className="left">
				<YouVersion width={140} height={20} />
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
	)
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
