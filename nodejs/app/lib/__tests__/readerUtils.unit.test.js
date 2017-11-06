import { isVerseOrChapter } from '../readerUtils';


const verseUSFMs = [
	{
		usfm: 'mat.1.1',
		isVerse: true,
	},
	{
		usfm: 'mat.1.11.esv',
		isVerse: true,
	},
	{
		usfm: 'mat.1.1-20.esv',
		isVerse: true,
	},
	{
		usfm: 'MAT.1.1,15.ESV',
		isVerse: true,
	},
]
const chapUSFMs = [
	{
		usfm: 'MAT.1.ESV',
		isChapter: true
	},
	{
		usfm: 'MAT.9_1.ESV',
		isChapter: true
	},
	{
		usfm: 'MAT.11.cawtwrg870',
		isChapter: true
	},
	{
		usfm: 'MAT.11',
		isChapter: true
	},
	{
		usfm: 'mat.INTRO1',
		isChapter: true
	},
]

describe('readerUtils', () => {
	describe('Function: isVerseOrChapter()', () => {
		it('validates verses', () => {
			verseUSFMs.forEach((usfm) => {
				const { isVerse } = isVerseOrChapter(usfm.usfm)
				expect(isVerse).toBe(usfm.isVerse)
			})
		});

		it('validates chapters', () => {
			chapUSFMs.forEach((usfm) => {
				const { isChapter } = isVerseOrChapter(usfm.usfm)
				expect(isChapter).toBe(usfm.isChapter)
			})
		});
	});
})
