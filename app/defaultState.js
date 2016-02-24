export default {
	event: {
		errors: {
			summary: '',
			fields: []
		},
		isFetching: false,
		isSaving: false,
		isDirty: false,
		item: {
			org_name: null,
			status: "draft",
			updated_dt: null,
			description: null,
			title: null,
			image: [],
			locations: {},
			content: [],
			created_dt: null,
			id: null,
			owner_id: null
		}
	},
	loc: {},
	locations: {
		hasError: false,
		errors: [],
		isFetching: false,
		items: []
	},
	references: {
		versions: {
			1: {
				abbreviation: "KJV",
			}

		},
		books: {
			1: [
				{'usfm': 'GEN', 'name': 'Genesis', 'chapters': 50},
				{'usfm': 'EXO', 'name': 'Exodus', 'chapters': 40},
				{'usfm': 'LEV', 'name': 'Leviticus', 'chapters': 27},
				{'usfm': 'NUM', 'name': 'Numbers', 'chapters': 36},
				{'usfm': 'DEU', 'name': 'Deuteronomy', 'chapters': 34},
				{'usfm': 'JOS', 'name': 'Joshua', 'chapters': 24},
				{'usfm': 'JDG', 'name': 'Judges', 'chapters': 21},
				{'usfm': 'RUT', 'name': 'Ruth', 'chapters': 4},
				{'usfm': '1SA', 'name': '1 Samuel', 'chapters': 31},
				{'usfm': '2SA', 'name': '2 Samuel', 'chapters': 24},
				{'usfm': '1KI', 'name': '1 Kings', 'chapters': 22},
				{'usfm': '2KI', 'name': '2 Kings', 'chapters': 25},
				{'usfm': '1CH', 'name': '1 Chronicles', 'chapters': 29},
				{'usfm': '2CH', 'name': '2 Chronicles', 'chapters': 36},
				{'usfm': 'EZR', 'name': 'Ezra', 'chapters': 10},
				{'usfm': 'NEH', 'name': 'Nehemiah', 'chapters': 13},
				{'usfm': 'EST', 'name': 'Esther', 'chapters': 10},
				{'usfm': 'JOB', 'name': 'Job', 'chapters': 42},
				{'usfm': 'PSA', 'name': 'Psalms', 'chapters': 150},
				{'usfm': 'PRO', 'name': 'Proverbs', 'chapters': 31},
				{'usfm': 'ECC', 'name': 'Ecclesiastes', 'chapters': 12},
				{'usfm': 'SNG', 'name': 'Song of Solomon', 'chapters': 8},
				{'usfm': 'ISA', 'name': 'Isaiah', 'chapters': 66},
				{'usfm': 'JER', 'name': 'Jeremiah', 'chapters': 52},
				{'usfm': 'LAM', 'name': 'Lamentations', 'chapters': 5},
				{'usfm': 'EZK', 'name': 'Ezekiel', 'chapters': 48},
				{'usfm': 'DAN', 'name': 'Daniel', 'chapters': 12},
				{'usfm': 'HOS', 'name': 'Hosea', 'chapters': 14},
				{'usfm': 'JOL', 'name': 'Joel', 'chapters': 3},
				{'usfm': 'AMO', 'name': 'Amos', 'chapters': 9},
				{'usfm': 'OBA', 'name': 'Obadiah', 'chapters': 1},
				{'usfm': 'JON', 'name': 'Jonah', 'chapters': 4},
				{'usfm': 'MIC', 'name': 'Micah', 'chapters': 7},
				{'usfm': 'NAM', 'name': 'Nahum', 'chapters': 3},
				{'usfm': 'HAB', 'name': 'Habakkuk', 'chapters': 3},
				{'usfm': 'ZEP', 'name': 'Zephaniah', 'chapters': 3},
				{'usfm': 'HAG', 'name': 'Haggai', 'chapters': 2},
				{'usfm': 'ZEC', 'name': 'Zechariah', 'chapters': 14},
				{'usfm': 'MAL', 'name': 'Malachi', 'chapters': 4},
				{'usfm': 'MAT', 'name': 'Matthew', 'chapters': 28},
				{'usfm': 'MRK', 'name': 'Mark', 'chapters': 16},
				{'usfm': 'LUK', 'name': 'Luke', 'chapters': 24},
				{'usfm': 'JHN', 'name': 'John', 'chapters': 21},
				{'usfm': 'ACT', 'name': 'Acts', 'chapters': 28},
				{'usfm': 'ROM', 'name': 'Romans', 'chapters': 16},
				{'usfm': '1CO', 'name': '1 Corinthians', 'chapters': 16},
				{'usfm': '2CO', 'name': '2 Corinthians', 'chapters': 13},
				{'usfm': 'GAL', 'name': 'Galatians', 'chapters': 6},
				{'usfm': 'EPH', 'name': 'Ephesians', 'chapters': 6},
				{'usfm': 'PHP', 'name': 'Philippians', 'chapters': 4},
				{'usfm': 'COL', 'name': 'Colossians', 'chapters': 4},
				{'usfm': '1TH', 'name': '1 Thessalonians', 'chapters': 5},
				{'usfm': '2TH', 'name': '2 Thessalonians', 'chapters': 3},
				{'usfm': '1TI', 'name': '1 Timothy', 'chapters': 6},
				{'usfm': '2TI', 'name': '2 Timothy', 'chapters': 4},
				{'usfm': 'TIT', 'name': 'Titus', 'chapters': 3},
				{'usfm': 'PHM', 'name': 'Philemon', 'chapters': 1},
				{'usfm': 'HEB', 'name': 'Hebrews', 'chapters': 13},
				{'usfm': 'JAS', 'name': 'James', 'chapters': 5},
				{'usfm': '1PE', 'name': '1 Peter', 'chapters': 5},
				{'usfm': '2PE', 'name': '2 Peter', 'chapters': 3},
				{'usfm': '1JN', 'name': '1 John', 'chapters': 5},
				{'usfm': '2JN', 'name': '2 John', 'chapters': 1},
				{'usfm': '3JN', 'name': '3 John', 'chapters': 1},
				{'usfm': 'JUD', 'name': 'Jude', 'chapters': 1},
				{'usfm': 'REV', 'name': 'Revelation', 'chapters': 22}
			]
		}

	},
	plans: {
		query: '',
		language_tag: 'en',
		items: [],
        focus_id: 0,
		isFetching: false
	},
	eventFeeds: {

		/* API: events/search */
		discover: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: []
		},

		/* API: events/saved_items */
		saved: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: []
		},

		/* API: events/items */
		mine: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: []
		}
	}
}
