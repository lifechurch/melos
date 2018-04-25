export default {
	event: {
		hasError: false,
		errors: [],
		isFetching: false,
		item: {
			org_name: 'Life.Church',
			status: 'draft',
			updated_dt: null,
			description: 'Life.Church is a group of people who gather together every week with the mission of transforming the world through the love of Jesus Christ. To find out more about our church or to watch the current message series that corresponds with today’s event, visit www.life.church.',
			title: 'The Time Is Now - Part 3',
			image: [
				{
					url: '//www.fillmurray.com/320/320',
					width: 320,
					height: 320
				},
				{
					url: '//www.fillmurray.com/g/1280/720',
					width: 1280,
					height: 720
				},
				{
					url: '//www.placecage.com/720/405',
					width: 720,
					height: 405
				},
				{
					url: '//www.fillmurray.com/640/360',
					width: 640,
					height: 360
				},
				{
					url: '//www.fillmurray.com/320/180',
					width: 320,
					height: 180
				}
			],
			locations: {
				3: {
					id: 3,
					times: [
						{
							id: 4,
							start_dt: '2015-11-23T19:48:14.607523+00:00',
							end_dt: '2015-11-23T20:48:14.607523+00:00'
						}
					]
				},
				2: {
					id: 2,
					times: [
						{
							id: 8,
							start_dt: '2015-11-23T19:48:14.607523+00:00',
							end_dt: '2015-11-23T20:48:14.607523+00:00'
						},
						{
							id: 15,
							start_dt: '2015-11-23T20:58:14.607523+00:00',
							end_dt: '2015-11-23T21:58:14.607523+00:00'
						}
					]
				}
			},
			content: [
				{
					sort: 0,
					data: {
						body: '<b>CONDITIONAL</b> obedience to God.',
						title: 'The Problem'
					},
					id: 3,
					type_id: 'general'
				},
				{
					sort: 1,
					data: {
						version_id: 116,
						usfm: [
							'HAG.2.12',
							'HAG.2.13',
							'HAG.2.14'
						]
					},
					id: 5,
					type_id: 'reference'
				},
				{
					sort: 2,
					data: {
						version_id: 116,
						usfm: [
							'HAG.2.15',
							'HAG.2.16',
							'HAG.2.17'
						]
					},
					id: 6,
					type_id: 'reference'
				},
				{
					sort: 3,
					data: {
						body: 'More than anything else, I want your <b>HEART</b>.',
						title: 'God Reminds His People'
					},
					id: 8,
					type_id: 'general'
				},
				{
					sort: 4,
					data: {
						version_id: 116,
						usfm: [
							'HAG.2.19'
						]
					},
					id: 7,
					type_id: 'reference'
				}
			],
			created_dt: '2015-11-23T02:52:46.563647+00:00',
			id: 2,
			owner_id: 7477
		}
	},
	locations: {
		3: {
			id: 3,
			city: 'Edmond',
			name: 'Life.Church Oklahoma City',
			update_dt: null,
			country: 'US',
			longitude: -97.548404,
			times: [
				{
					id: 4,
					start_dt: '2015-11-23T19:48:14.607523+00:00',
					end_dt: '2015-11-23T20:48:14.607523+00:00'
				}
			],
			region: 'OK',
			geohash: '9y6du4x7m',
			created_dt: '2015-11-23T02:56:51.646551+00:00',
			latitude: 35.653959,
			timezone: 'America/Chicago',
			postal_code: '73012',
			formatted_address: '2001 NW 178th St\nEdmond, OK 73012'
		},
		2: {
			id: 2,
			city: 'Edmond',
			name: 'Life.Church Edmond',
			update_dt: null,
			country: 'US',
			longitude: -97.421297,
			times: [
				{
					id: 8,
					start_dt: '2015-11-23T19:48:14.607523+00:00',
					end_dt: '2015-11-23T20:48:14.607523+00:00'
				},
				{
					id: 15,
					start_dt: '2015-11-23T20:58:14.607523+00:00',
					end_dt: '2015-11-23T21:58:14.607523+00:00'
				}
			],
			region: 'OK',
			geohash: '9y6dz1gcp',
			created_dt: '2015-11-23T02:54:34.740758+00:00',
			latitude: 35.64947,
			timezone: 'America/Chicago',
			postal_code: '73034',
			formatted_address: '4600 E. 2nd St\nEdmond, OK 73034'
		}
	},
	eventFeeds: {

		/* API: events/search */
		discover: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: [
			]
		},

		/* API: events/saved_items */
		saved: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: [
			]
		},

		/* API: events/items */
		mine: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: [
				{
					org_name: 'Test Church',
					status: 2,
					updated_dt: '2015-12-08T18:18:36.645193+00:00',
					description: null,
					title: 'Test Event 2',
					locations: null,
					created_dt: '2015-12-08T18:16:25.295942+00:00',
					id: 18,
					owner_id: 1
				},
				{
					org_name: 'Test Church',
					status: 0,
					updated_dt: null,
					description: null,
					title: 'Test Event',
					locations: [
						1
					],
					created_dt: '2015-12-07T17:31:41.028161+00:00',
					id: 9,
					owner_id: 1
				}
			]
		},

		/* API: ?? */
		stats: {
			isFetching: false,
			didInvalidate: false,
			items: [
			]
		},
	},
	loc: {
		place: {}
	}
}