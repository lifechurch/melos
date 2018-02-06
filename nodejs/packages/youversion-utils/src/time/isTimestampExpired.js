import moment from 'moment'

export default function isTimestampExpired(expiration) {
	return parseInt(moment().unix(), 10) >= parseInt(expiration, 10)
}
