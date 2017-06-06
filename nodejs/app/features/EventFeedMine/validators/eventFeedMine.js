export function validateDuplicateParams(params) {
	const { id } = params
	if (typeof id !== 'number') {
		throw new Error('Duplicate: Invalid Event Id')
	}
}