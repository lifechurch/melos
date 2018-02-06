export default ({ text, tag, words }) => {
	const regex = RegExp(words.join('|'), 'gi') // case insensitive
	const replacement = `<${tag}>$&</${tag}>`

	return text.replace(regex, replacement)
}
