import { createSelector } from 'reselect'
import { getImages } from '../endpoints/images/reducer'

const getImagesModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getImages ],
	(images) => {
		const imagesModel = { images: {} }

		if (images) {
			imagesModel.images = images
		}

		// utility functions on model
		imagesModel.filter = ({ category = null, usfm = null, language_tag = null }) => {
			const matchedImages = []
			if (imagesModel.images.all && imagesModel.images.all.length > 0) {
				imagesModel.images.all.forEach((img) => {
					let usfmMatch = !usfm
					if (usfm && img.usfm) {
						const usfmsToCheck = Array.isArray(usfm)
							? usfm
							: [usfm]
						usfmMatch = usfmsToCheck.some((usfmToCheck) => {
							return img.usfm.includes(usfmToCheck)
						})
					}
					const categoryMatch = !category || img.category === category
					const langMatch = !language_tag || img.language_tag === language_tag
					if (categoryMatch && usfmMatch && langMatch) {
						matchedImages.push(img)
					}
				})
			}

			return matchedImages
		}

		return imagesModel
	}
)

export default getImagesModel
