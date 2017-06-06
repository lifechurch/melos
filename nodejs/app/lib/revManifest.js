import RevManifest from '../../rev-manifest.json'

export default function revManifest(filename) {
	if ((typeof window !== 'undefined' && window.__ENV__=="production") ||
		(typeof process !== 'undefined' && process.env.NODE_ENV=="production")){
		return RevManifest[filename]
	} else {
		return filename
	}
}
