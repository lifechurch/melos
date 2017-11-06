import moment from 'moment'

export default function isTimestampExpired(expiration) {
	return moment().unix() >= expiration
}
