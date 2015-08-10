//= require angular
//= require angular-ui-router
//= require angular-sanitize
//= require angular-animate
//= require angular-resource
//= require angular-aria
//= require vendor/angular-material/angular-material
//= require main
//= require_tree ./api
//= require_tree ./common
//= require_tree ./references
//= require_tree ./moments
//= require vendor/angular-cache/angular-cache
//= require vendor/angular-tooltips/angular-tooltips.min.js

var TEMPLATE_FROM_RAILS = {};

function parseReaderVars() {
 	var prev_link = angular.element(document.getElementById("reader_previous")).attr("href").split("/");
 	var next_link = angular.element(document.getElementById("reader_next")).attr("href").split("/");

	TEMPLATE_FROM_RAILS[window.location.pathname] = { 
		reader_book: angular.element(document.getElementById("reader_book")).text(),
		reader_chapter: angular.element(document.getElementById("reader_chapter")).text(),
		reader_version: angular.element(document.getElementById("reader_version")).text(),		
		reader_html: angular.element(document.getElementById("reader")).html(),
		reader_audio: {
			title: angular.element(document.getElementById("reader_audio_title")).text(),
			copyright_short: {
				text: angular.element(document.getElementById("reader_audio_copyright_short")).text()
			},
			url: angular.element(document.getElementById("reader_audio_player")).attr("src")
		},
		previous_chapter_hash: {
			version_id: prev_link[2],
			usfm: [ prev_link[3] ]
		},
		next_chapter_hash: {
			version_id: next_link[2],
			usfm: [ next_link[3] ]
		} 
	};
}

function init() {
	if (window.location.pathname.indexOf("/bible") == 0) {
		parseReaderVars();
	}
	angular.bootstrap(document, ['yv']);
}