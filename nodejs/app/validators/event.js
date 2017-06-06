import { isNotBlank } from './common'

export function isEventDetailsValid(event) {
	return isNotBlank(event, ['title', 'org_name']);
}
