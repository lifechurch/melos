//= require jquery
//= require foundation/foundation
//= require angular
//= require angular-ui-router
//= require angular-sanitize
//= require angular-animate
//= require angular-resource
//= require angular-cookies
//= require angular-aria
//= require vendor/angular-material/angular-material
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
//= require_tree ./footer
//= require_tree ./plans
//= require_tree ./videos
//= require_tree ./catchAll
//= require_tree ./friendships
//= require_tree ./search
//= require vendor/angular-cache/angular-cache
//= require vendor/angular-tooltips/angular-tooltips.min.js
//= require vendor/md-color-picker/tinycolor-min.js
//= require vendor/md-color-picker/mdColorPicker.js
//= require vendor/jstimezone/dist/jstz.min.js

var TEMPLATE_FROM_RAILS = {};

function parseReaderVars() {
    var prev_link = [], next_link = [];
    var version_pos;
    var usfm_pos;

    if (!getLocale()) {
        version_pos = 2;
        usfm_pos = 3;
    } else {
        version_pos = 3;
        usfm_pos = 4;
    }

    if (document.getElementById("reader_previous")) {
        prev_link = angular.element(document.getElementById("reader_previous")).attr("href").split("/");
    }

    if (document.getElementById("reader_next")) {
        next_link = angular.element(document.getElementById("reader_next")).attr("href").split("/");
    }

	TEMPLATE_FROM_RAILS[window.location.pathname] = { 
		reader_book: angular.element(document.getElementById("reader_book")).text(),
		reader_chapter: angular.element(document.getElementById("reader_chapter")).text(),
		reader_version: angular.element(document.getElementById("reader_version")).text(),
        copyright_text: angular.element(document.getElementById("copyright_text")).text(),
        learn_more: angular.element(document.getElementById("learn_more")).text(),
		reader_html: angular.element(document.getElementById("reader")).html(),
		reader_audio: {
			title: angular.element(document.getElementById("reader_audio_title")).text(),
			copyright_short: {
				text: angular.element(document.getElementById("reader_audio_copyright_short")).text()
			},
			url: angular.element(document.getElementById("reader_audio_player")).attr("src")
		},
		previous_chapter_hash: {
			version_id: prev_link[version_pos],
			usfm: [ prev_link[usfm_pos] ]
		},
		next_chapter_hash: {
			version_id: next_link[version_pos],
			usfm: [ next_link[usfm_pos] ]
		} 
	};
}

function parsePlanVars() {
	parseReaderVars();
	TEMPLATE_FROM_RAILS[window.location.pathname].devotional_content = angular.element(document.getElementById('widget-devotional')).html();
}

function getLocale() {
    var firstSegment = window.location.pathname.split("/")[1];
    var re = /^[a-zA-Z]{2}(?:\-{1}[a-zA-Z]{2})*$/;
    return re.exec(firstSegment);
}


function isFirst(segment, path) {
    if (!path) {
        path = window.location.pathname;
    }
    var segments = path.split("/");
    segments.shift();
    if (getLocale()) {
        segments.shift();
    }
    return segments.indexOf(segment) == 0;
}


function getFirst(path) {
    if (!path) {
        path = window.location.pathname;
    }
    var segments = path.split("/");
    segments.shift();
    if (getLocale()) {
        segments.shift();
    }
    return segments[0];
}


function inPathNotFirst(segment, path) {
    if (!path) {
        path = window.location.pathname;
    }
    var segments = path.split("/");
    segments.shift();
    if (getLocale()) {
        segments.shift();
    }
    return segments.indexOf(segment) > 0;
}

function init() {

	if (isReader || isReadingPlanSample || isReaderPlanUser) {
		parseReaderVars();
	}

    if (isEvents || isResetPassword) {
        angular.bootstrap(document.getElementById('fixed-page-header'), ['yv']);
    } else {
        angular.bootstrap(document, ['yv']);
    }

}

var isEvents            = isFirst("events");
var isResetPassword     = isFirst("resetPassword");
var isReadingPlanSample = isFirst("reading-plans") && inPathNotFirst("day");
var isReader 			= isFirst("bible");
var isHomeFeed 			= isFirst("moments");

var isFriendsFeed		= isFirst("users") && inPathNotFirst("friends");
var isNotesFeed			= isFirst("users") && inPathNotFirst("notes");
var isBookmarksFeed		= isFirst("users") && inPathNotFirst("bookmarks");
var isHighlightsFeed	= isFirst("users") && inPathNotFirst("highlights");
var isImagesFeed		= isFirst("users") && inPathNotFirst("images");
var isBadgesFeed		= isFirst("users") && inPathNotFirst("badges");
var isReaderPlanUser	= isFirst("users") && inPathNotFirst("reading-plans") && inPathNotFirst("ref");
var isUserProfile 		= isFirst("users") && !isNotesFeed && !isHighlightsFeed && !isBookmarksFeed && !isImagesFeed && !isBadgesFeed && !isFriendsFeed;