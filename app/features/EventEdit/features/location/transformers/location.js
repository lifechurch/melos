import moment from 'moment'

export function toApiFormat(loc) {
	
	var times = loc.times.map((t) => {
		return { 
			start_dt: t.start_dt.format('YYYY-MM-DDTHH:mm:ssZ'),
			end_dt: t.end_dt.format('YYYY-MM-DDTHH:mm:ssZ')
		}
	})

	return {
		id: loc.eventId,
		name: loc.name,
		type: loc.type,
		timezone: loc.timezone,
		city: loc.city,
		country: loc.country,
		latitude: loc.latitude,
		longitude: loc.longitude,
		formatted_address: loc.formatted_address,
		google_place_id: loc.google_place_id,
		region: loc.region,
		postal_code: loc.postal_code,
		times: times 
	}	
}

export function fromApiFormat(loc) {
	let { times } = loc
	const newTimes = times.map((t) => {
		const { start_dt, end_dt } = t
		return {
			start_dt: moment(start_dt),
			end_dt: moment(end_dt)
		}
	})
	return Object.assign({}, loc, { times: newTimes })
}