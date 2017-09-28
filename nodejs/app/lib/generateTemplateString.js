/**
 *  see: https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
 *
 * Produces a function which uses template strings to do simple interpolation from objects.
 *
 * Usage:
 *    var makeMeKing = generateTemplateString('${name} is now the king of {country}!');
 *
 *    console.log(makeMeKing({ name: 'Bryan', country: 'Scotland'}));
 *    // Logs 'Bryan is now the king of Scotland!'
 */
const generateTemplateString = (function () {
	const cache = {}

	function generateTemplate(template) {
		let fn = cache[template]

		if (!fn) {
			// Replace ${expressions} (etc) with ${map.expressions}.
			const sanitized = template
				.replace(/\$?\{([\s]*[^;\s\{]+[\s]*)\}/g, (_, match) => {
					return `\$\{map.${match.trim()}\}`
				})
				// Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
				.replace(/(\$\{(?!map\.)[^}]+\})/g, '')

			fn = Function('map', `return \`${sanitized}\``)
			cache[template] = fn
		}

		return fn
	}

	return generateTemplate
}())

export default generateTemplateString
