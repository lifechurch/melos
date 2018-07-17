const versionsWithUnderscores = [
	'24',
	'1981'
]

export default function getDefaultChapter(version) {
	return (
    versionsWithUnderscores.indexOf(version.toString().toLowerCase()) > -1
      ? 'JHN.1_1'
      : 'JHN.1'
	)
}
