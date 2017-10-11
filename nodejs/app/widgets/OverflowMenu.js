import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import ClickToCopy from '../components/ClickToCopy'
import Overflow, {
	Read,
	ReadFullChapter,
	Copy,
	Share,
	Edit,
	Delete,
	Cancel
} from '../components/OverflowMenu'
import {
	isVerseOrChapter,
	chapterifyUsfm,
	parseVerseFromContent,
	getBibleVersionFromStorage
} from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import Routes from '../lib/routes'


class OverflowMenu extends Component {
	componentDidMount() {
		const { usfm, plan_id, subscription_id, dispatch } = this.props
	}

	render() {
		const {
			usfm,
			version_id,
			plan_id,
			subscription_id,
			onEdit,
			onDelete,
			children,
			serverLanguageTag,
			bible,
			hosts,
		} = this.props

		let readFullChapLink, readLink = null
		let copyAction = null
		// if we have usfm and version then let's build out links and data for
		// reading and copying the reference
		if (usfm && version_id) {
			if (isVerseOrChapter(usfm).isVerse) {
				const versionData = bible
					&& bible.versions
					&& bible.versions.byId
					&& bible.versions.byId[version_id]
					&& bible.versions.byId[version_id].response
				const title = versionData
					&& versionData.books
					&& getReferencesTitle({
						bookList: versionData.books,
						usfmList: usfm,
					}).title
				console.log('ASKFJWENGR', title, usfm)
				readLink = Routes.reference({
					usfm,
					version_id,
					version_abbr: versionData && versionData.local_abbreviation,
					serverLanguageTag,
				})
				readFullChapLink = Routes.reference({
					usfm: chapterifyUsfm(usfm),
					version_id,
					version_abbr: versionData && versionData.local_abbreviation,
					serverLanguageTag,
				})
				// copy
				const ref = bible && bible.pullRef(chapterifyUsfm(usfm))
				if (ref) {
					copyAction = (
						<ClickToCopy
							text={`${parseVerseFromContent({ usfms: usfm, fullContent: ref.content }).text}\n${title} ${versionData && versionData.local_abbreviation.toUpperCase()}\n\n${hosts.railsHost}${readLink}`}
						>
							<Copy />
						</ClickToCopy>
					)
				}
			}
		}

		return (
			<Overflow>
				{
					readFullChapLink
						&& (
							<ReadFullChapter link={readFullChapLink} />
						)
				}
				{
					readLink
						&& (
							<Read link={readLink} />
						)
				}
				{ copyAction }
				{
					onEdit
						&& (
							<Edit onClick={onEdit} />
						)
				}
				{
					onDelete
						&& (
							<Delete onClick={onDelete} />
						)
				}
				{/* allow additional actions to be rendered */}
				{ children }
				<Cancel />
			</Overflow>
		)
	}
}

OverflowMenu.propTypes = {

}

OverflowMenu.defaultProps = {

}

function mapStateToProps(state) {
	return {
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(OverflowMenu)
