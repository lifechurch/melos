export default function deepLinkPath(chapUsfm, versionID, versionAbbr, verseNum = null) {
	if (!chapUsfm) { return null }
	let android, ios, native

	if (verseNum && versionID) {
		ios = `bible?reference=${chapUsfm}.${verseNum}&version_id=${versionID}`
		android = `bible?reference=${chapUsfm}.${verseNum}&version=${versionID}`
		native = `bible?reference=${chapUsfm}.${verseNum}.${versionAbbr}&version=${versionID}`
	} else if (versionID) {
		ios = `bible?reference=${chapUsfm}&version_id=${versionID}`
		android = `bible?reference=${chapUsfm}&version=${versionID}`
		native = `bible?reference=${chapUsfm}.${versionAbbr}&version=${versionID}`
	} else {
		ios = `bible?reference=${chapUsfm}`
		android = `bible?reference=${chapUsfm}`
		native = `bible?reference=${chapUsfm}`
	}

	return { android, ios, native }
}
