import type from './constants'
import { routeActions } from 'react-router-redux'

function cancel() {
	return dispatch => {
		dispatch(routeActions.push('/'))
		dispatch({ type: type('cancel') })
	}
}

function newEvent() {
	return {
		type: type('new')
	}
}

function imgUpload(params) {
	return {
		api_call: {
			endpoint: 'events',
			method: 'image_upload',
			version: '3.2',
			auth: true,
			params: {},
			http_method: 'get',
			types: [ type('imgUpload'), type('imgUploadSuccess'), type('imgUploadFailure') ]
		},
		params
	}
}

function imgUploadFailure(params) {
	return {
		type: type('imgUploadFailure'),
		params
	}
}

function view(id, auth=true) {
	return {
		api_call: {
			endpoint: 'events',
			method: 'view',
			version: '3.2',
			auth,
			params: { id },
			http_method: 'get',
			types: [ type('viewRequest'), type('viewSuccess'), type('viewFailure') ]
		}
	}
}

function create(event) {
	const { title, org_name, description } = event
	return {
		api_call: {
			endpoint: 'events',
			method: 'create',
			version: '3.2',
			auth: true,
			params: {title, org_name, description},
			http_method: 'post',
			types: [ type('createRequest'), type('createSuccess'), type('createFailure') ]
		}
	}
}

function update(event) {
	const { id, title, org_name, description, image_id } = event
	const params = { id, title, org_name, description, image_id }
	return {
		params,
		api_call: {
			endpoint: 'events',
			method: 'update',
			version: '3.2',
			auth: true,
			params,
			http_method: 'post',
			types: [ type('updateRequest'), type('updateSuccess'), type('updateFailure') ]
		}
	}
}

function setDetails(field, value) {
	return {
		type: type('setDetails'),
		field,
		value
	}
}

function saveDetails(event, goNext) {
	return dispatch => {

		function handlePromise(goNext, response) {
			if (goNext === true && typeof response == 'object' && typeof response.id == 'number') {
				const nextUrl = '/event/edit/' + response.id + '/locations_and_times'
				dispatch(routeActions.push(nextUrl))
			}
		}

		if (typeof event.id === 'number') {
			dispatch(update(event)).then((response) => {
				handlePromise(goNext, response)
			})
		} else {
			dispatch(create(event)).then((response) => {
				handlePromise(goNext, response)
			})
		}

	}
}

export default {
	cancel,
	new: newEvent,
	imgUpload,
	imgUploadFailure,
	view,
	create,
	update,
	setDetails,
	saveDetails
}
