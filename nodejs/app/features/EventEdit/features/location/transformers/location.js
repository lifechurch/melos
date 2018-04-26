import moment from 'moment-timezone'

export function toApiFormat(loc) {

	const times = loc.times.map((t) => {
		return {
			start_dt: t.start_dt.format('YYYY-MM-DDTHH:mm:ssZ'),
			end_dt: t.end_dt.format('YYYY-MM-DDTHH:mm:ssZ')
		}
	})

	if (loc.type === 'physical') {
		return {
			id: loc.eventId,
			location_id: loc.id || null,
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
			times
		}
	} else {
		return {
			id: loc.eventId,
			location_id: loc.id || null,
			name: loc.name,
			type: loc.type,
			timezone: loc.timezone,
			region: loc.region,
			postal_code: loc.postal_code,
			times
		}
	}
}

export function fromApiFormat(loc) {
	const { times } = loc
	let newTimes = []
	if (Array.isArray(times)) {
		newTimes = times.map((t) => {
			const { start_dt, end_dt } = t
			return {
				start_dt: moment.tz(start_dt, loc.timezone),
				end_dt: moment.tz(end_dt, loc.timezone)
			}
		})
	}
	return Object.assign({}, loc, { times: newTimes })
}