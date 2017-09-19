import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import Immutable from 'immutable'
import ga from 'react-ga'
import { connect } from 'react-redux'
import streaksAction from '@youversion/api-redux/lib/endpoints/streaks/action'
import { getConfiguration } from '@youversion/api-redux/lib/endpoints/bible/reducer'
import ResponsiveContainer from '../../../components/ResponsiveContainer'
import DropdownTransition from '../../../components/DropdownTransition'
import XMark from '../../../components/XMark'
import FooterContent from './FooterContent'
import LangSelector from './LangSelector'
import LinkCard from './LinkCard'
import localOnceDaily from '../../../lib/localOnceDaily'

class Footer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			linksOpen: false,
			langSelectorOpen: false
		}
	}

	componentDidMount() {
		const { dispatch, auth } = this.props
		const immAuth = Immutable.fromJS(auth)
		const userIdKeyPath = [ 'userData', 'userid' ]

		if (immAuth.hasIn(userIdKeyPath)) {
			const userId = immAuth.getIn(userIdKeyPath)
			localOnceDaily(`DailyStreakCheckin-${userId}`, (handleSuccess) => {
				const today = moment()

				// Streaks Checkin
				dispatch(streaksAction({
					method: 'checkin',
					params: {
						user_id: userId,
						day_of_year: today.dayOfYear(),
						year: today.year()
					}
				})).then((response) => {
					if ('current_streak' in response && typeof handleSuccess === 'function') {
						handleSuccess()

						// Google Analytics Event
						if (window.location.hostname === 'www.bible.com') {
							ga.event({
								category: 'User',
								action: 'StreaksCheckin',
								value: parseInt(response.current_streak.toString(), 10)
							})
						}
					}
				})
			})
		}
	}

	handleLangClose = () => {
		this.setState({ langSelectorOpen: false })
	}

	handleLinksClose = () => {
		this.setState({ linksOpen: false })
	}

	handleLangClick = () => {
		this.setState((state) => {
			return { langSelectorOpen: !state.langSelectorOpen }
		})
	}

	handleLinksClick = () => {
		this.setState((state) => {
			return { linksOpen: !state.linksOpen }
		})
	}

	render() {
		const {
      serverLanguageTag,
			bibleConfiguration
    } = this.props

		const {
      langSelectorOpen,
      linksOpen
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
			<ResponsiveContainer>
				<FooterContent
					{...this.props}
					onLangClose={this.handleLangClose}
					onLinksClose={this.handleLinksClose}
					onLangClick={this.handleLangClick}
					onLinksClick={this.handleLinksClick}
					langSelectorOpen={langSelectorOpen}
					linksOpen={linksOpen}
					versions={versions}
					languages={languages}
				/>
				<div className="yv-fullscreen-modal-container">
					<DropdownTransition
						show={langSelectorOpen}
						hideDir="down"
						transition={true}
						onOutsideClick={this.handleLangClose}
						exemptClass="yv-lang-toggle"
						classes="yv-fullscreen-modal-content"
					>
						<a tabIndex={0} className="yv-close-x" onClick={this.handleLangClose}><XMark width={15} height={15} fill="#444444" /></a>
						<LangSelector {...this.props} />
					</DropdownTransition>
				</div>
				<div className="yv-fullscreen-modal-container">
					<DropdownTransition
						show={linksOpen}
						hideDir="down"
						transition={true}
						onOutsideClick={this.handleLinksClose}
						exemptClass="yv-link-toggle"
						classes="yv-fullscreen-modal-content"
					>
						<a tabIndex={0} className="yv-close-x" onClick={this.handleLinksClose}><XMark width={15} height={15} fill="#444444" /></a>
						<LinkCard serverLanguageTag={serverLanguageTag} versions={versions} languages={languages} />
					</DropdownTransition>
				</div>
			</ResponsiveContainer>
		)
	}
}

Footer.propTypes = {
	serverLanguageTag: PropTypes.string,
	bibleConfiguration: PropTypes.object,
	auth: PropTypes.object,
	dispatch: PropTypes.func.isRequired
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
