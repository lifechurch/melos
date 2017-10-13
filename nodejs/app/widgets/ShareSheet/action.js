
export default function share({
	isOpen,
	text = null,
	url = null,
	custom = null,
}) {
	return {
		type: 'SHARE_ACTION',
		data: {
			isOpen,
			text,
			url,
			custom
		}
	}
}
