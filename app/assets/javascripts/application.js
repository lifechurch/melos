//= require angular
//= require angular-ui-router
//= require angular-sanitize
//= require main
//= require references/references

var template = {};

function init() {
 	var prev_link = angular.element(document.getElementById("reader_previous")).attr("href").split("/");
 	var next_link = angular.element(document.getElementById("reader_next")).attr("href").split("/");

	template[window.location.pathname] = { 
		reader_book: angular.element(document.getElementById("reader_book")).text(),
		reader_chapter: angular.element(document.getElementById("reader_chapter")).text(),
		reader_version: angular.element(document.getElementById("reader_version")).text(),		
		reader_html: angular.element(document.getElementById("reader")).html(),
		reader_audio: {
			url: angular.element(document.getElementById("reader_audio")).attr("src")
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

	//angular.bootstrap(document, ['yv']);
}