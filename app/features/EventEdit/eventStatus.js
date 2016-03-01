const constants = {
	draft: 'draft',
	published: 'published',
	live: 'live',
	archived: 'archived'
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Event Status: ' + key)
	}
}
