import RevManifest from '../../rev-manifest.json'

export default function revManifest(filename) {
	return window.__ENV__=="production" ? RevManifest[filename] : filename
}
