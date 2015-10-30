//= require angular
//= require angular-ui-router
//= require angular-sanitize
//= require angular-animate
//= require angular-resource
//= require angular-aria
//= require vendor/angular-material/angular-material
//= require jquery
//= require vendor/branch/branchMetrics
//= require branch/intlTelInput.min
//= require branch/sms_for_app
//= require branch/branch
//= require main
//= require slick.min
//= require_tree ./api
//= require_tree ./common
//= require_tree ./references
//= require_tree ./moments
//= require_tree ./header
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

function parsePlanVars() {
	parseReaderVars();
	TEMPLATE_FROM_RAILS[window.location.pathname].devotional_content = angular.element(document.getElementById('widget-devotional')).html();
}

function inDefaultLocale() {
    return window.location.pathname.split("/")[1].length != 2;
}

function firstPos() {
    if (inDefaultLocale()) {
        return 0;
    } else {
        return 3;
    }
}

function isFirst(segment) {
    return window.location.pathname.indexOf(segment) == firstPos();
}

function inPathNotFirst(segment) {
    return window.location.pathname.indexOf(segment) > firstPos();
}

function init() {
	var isReadingPlanSample = isFirst("/reading-plans") && inPathNotFirst("/day/");
	var isReader 			= isFirst("/bible");
	var isHomeFeed 			= isFirst("/moments");
	
	var isFriendsFeed		= isFirst("/users") && inPathNotFirst("/friends");
	var isNotesFeed			= isFirst("/users") && inPathNotFirst("/notes");
	var isBookmarksFeed		= isFirst("/users") && inPathNotFirst("/bookmarks");
	var isHighlightsFeed	= isFirst("/users") && inPathNotFirst("/highlights");
	var isImagesFeed		= isFirst("/users") && inPathNotFirst("/images");
	var isBadgesFeed		= isFirst("/users") && inPathNotFirst("/badges");
	var isReaderPlanUser	= isFirst("/users") && inPathNotFirst("/reading-plans");
	var isUserProfile 		= isFirst("/users") && !isNotesFeed && !isHighlightsFeed && !isBookmarksFeed && !isImagesFeed && !isBadgesFeed && !isFriendsFeed;

	if (isReader) {
		parseReaderVars();
	}

	if (isReadingPlanSample || isReaderPlanUser) {
		parsePlanVars();
	}	

	if (isReader || isReadingPlanSample || isReaderPlanUser || isHomeFeed || isUserProfile || isNotesFeed || isHighlightsFeed || isBookmarksFeed || isImagesFeed) {
		angular.bootstrap(document, ['yv']);
	}
}