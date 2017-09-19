const SMALL_BREAKPOINT = 600
const MEDIUM_BREAKPOINT = 1024

export const ScreenSize = {
	SMALL: 0,
	MEDIUM: 1,
	LARGE: 2
}

export function getScreenSize(width) {
	if (width > 0 && width < SMALL_BREAKPOINT) {
		return ScreenSize.SMALL
	} else if (width < MEDIUM_BREAKPOINT) {
		return ScreenSize.MEDIUM
	} else {
		return ScreenSize.LARGE
	}
}
