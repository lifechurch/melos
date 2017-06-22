export default function getCurrentDT() {
	return `${new Date().toISOString().split('.')[0]}+00:00`
}
