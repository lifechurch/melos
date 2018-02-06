export default function imgLoaded(imgElement) {
	return imgElement && imgElement.complete && imgElement.naturalHeight !== 0
}
