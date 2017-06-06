import RevManifest from '../../rev-manifest.json'

export default function revManifest(filename) {
	return RevManifest[filename]
}
