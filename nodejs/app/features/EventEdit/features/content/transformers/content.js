export function toApiFormat(content) {
	const { data, type } = content
	let { body } = data
	if (typeof type === 'string' && ['announcement', 'text'].indexOf(type) !== -1 && typeof body === 'string') {
		body = body
			.replace(/<div><br><\/div>/g, '<br>')
			.replace(/<div>/g, '')
			.replace(/<\/div>$/g, '')
			.replace(/<\/div>/g, '<br>')
			.replace(/&nbsp;/g, ' ')
	}
	return Object.assign({}, content, {
		data: {
			...data,
			body
		}
	})
}

export function fromApiFormat(content) {
	const { data, type } = content
	let { body } = data
	if (typeof type === 'string' && ['announcement', 'text'].indexOf(type) !== -1 && typeof body === 'string') {
		body = `<div>${body.replace(/<br>/g, '</div><div>').replace(/<div><\/div>/g, '<div><br></div>')}</div>`
	}
	return Object.assign({}, content, {
		data: {
			...data,
			body
		},
		errors: {}
	})
}

