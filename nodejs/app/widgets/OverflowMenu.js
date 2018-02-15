import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import isVerseOrChapter from '@youversion/utils/lib/bible/isVerseOrChapter'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import parseVerseFromContent from '@youversion/utils/lib/bible/parseVerseContent'
import Routes from '@youversion/utils/lib/routes/routes'
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


function OverflowMenu(props) {
	const {
		usfm,
		version_id,
		plan_id,
		subscription_id,
		together_id,
		onEdit,
		onDelete,
		children,
		serverLanguageTag,
		bible,
		hosts,
	} = props

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
			const refStrings = versionData
				&& versionData.books
				&& getReferencesTitle({
					bookList: versionData.books,
					usfmList: usfm,
				})
			const usfmString = refStrings && refStrings.usfm
			readLink = Routes.reference({
				usfm: usfmString,
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
						text={`${parseVerseFromContent({ usfms: usfm, fullContent: ref.content }).text}\n${refStrings && refStrings.title} ${versionData && versionData.local_abbreviation.toUpperCase()}\n\n${hosts.railsHost}${readLink}`}
					>
						<Copy />
					</ClickToCopy>
				)
			}
		}
	}

	// TODO: just as we did with the usfm, let's pull in plan/subscription/together
	// data if those are passed in
	// i.e. start plan link, read plan link, participants link, etc...

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

OverflowMenu.propTypes = {
	usfm: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	plan_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	subscription_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
	children: PropTypes.node,
	serverLanguageTag: PropTypes.string.isRequired,
	bible: PropTypes.object,
	hosts: PropTypes.object,
}

OverflowMenu.defaultProps = {
	usfm: null,
	version_id: null,
	plan_id: null,
	subscription_id: null,
	together_id: null,
	onEdit: null,
	onDelete: null,
	children: null,
	serverLanguageTag: null,
	bible: null,
	hosts: null,
}

function mapStateToProps(state) {
	return {
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(OverflowMenu)
