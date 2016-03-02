import RevManifest from '../../rev-manifest.json'

export default function revManifest(filename) {
	if ((window && window.__ENV__=="production") || (process && process.env.NODE_ENV=="production")){
		return RevManifest[filename]
	} else {
		return filename
	}
}
