export default function chapterifyUsfm(usfmArg) {
	if (!usfmArg) return null
	const usfm = Array.isArray(usfmArg)
		? usfmArg[0]
		: usfmArg
	const usfmParts = usfm.split('.')
	return usfmParts.slice(0, 2).join('.')
}
