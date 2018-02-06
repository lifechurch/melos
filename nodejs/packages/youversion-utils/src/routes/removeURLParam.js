export default function removeURLParameter(url, parameter) {
	const urlparts = url.split('?')
	if (urlparts.length >= 2) {

		const prefix = `${encodeURIComponent(parameter)}=`
		const pars = urlparts[1].split(/[&;]/g)

    // reverse iteration as may be destructive
		for (let i = pars.length; i-- > 0;) {
      // idiom for string.startsWith
			if (pars[i].lastIndexOf(prefix, 0) !== -1) {
				pars.splice(i, 1)
			}
		}

		return urlparts[0] + (pars.length > 0 ? `?${pars.join('&')}` : '')
	}

	return url
}
