export default function getCreatedDT() {
	return `${new Date().toISOString().split('.')[0]}+00:00`
}
