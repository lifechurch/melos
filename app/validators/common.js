export function isNotBlank(object, keys) {
	return keys.every((key) => {
		return 	object && 
						typeof(object) === "object" && 
						object.hasOwnProperty(key) && 
						object[key].hasOwnProperty('length') &&
						object[key].length > 0
	})
}