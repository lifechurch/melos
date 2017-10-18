
export default function share({
	isOpen,
	text = null,
	url = null,
}) {
	return {
		type: 'SHARE_ACTION',
		data: {
			isOpen,
			text,
			url,
		}
	}
}
