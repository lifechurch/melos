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

var firebaseMessaging = false
function init() {
    if (isEvents ||
      isResetPassword ||
      isPlanIndex ||
      isPlanCollection ||
      isSignUp ||
      isSignIn ||
      isReader ||
      isPassage ||
      isUserReadingPlan ||
      isReadingPlanSample ||
      isLookInside ||
      isTIORedirect ||
      isNotifications ||
      isVOTD ||
      isSnapshot ||
      isExplore ||
      isTerms ||
      isPrivacy
    ) {
        // angular.bootstrap(document.getElementById('fixed-page-header'), ['yv']);
    } else {
        angular.bootstrap(document, ['yv']);
    }

    if (gapi) {
        gapi.load('auth2', function () {
            gapi.auth2.init();
        })
    }

    // if ('serviceWorker' in navigator) {
    //   // serviceWorker caching
    //   navigator.serviceWorker
    //     .register('./serviceWorker.js', { scope: '/' })
    //     .then(function(reg) {
    //       console.log('Service Worker Registered', reg)
		// 			// Retrieve Firebase Messaging object.
		// 			// firebaseMessaging = firebase.messaging().useServiceWorker(reg)
		// 			firebaseMessaging = firebase.messaging()
		// 			firebaseMessaging.useServiceWorker(reg)
		//
		// 			/**
		// 			 * token refresh
		// 			 *
		// 			 * Callback fired if Instance ID token is updated.
		// 			 */
		// 			firebaseMessaging.onTokenRefresh(function() {
		// 				firebaseMessaging.getToken()
		// 					.then(function(refreshedToken) {
		// 						console.log('Token refreshed.')
		// 						// send token to server using react prompt component
		// 						const prompt = document.getElementById('notifications-prompt')
		// 						console.log('PROMSTP', prompt)
		// 						if (prompt) {
		// 							prompt.dispatchEvent(
		// 								new CustomEvent(
		// 									'sendTokenToServer',
		// 									{ detail: refreshedToken }
		// 								)
		// 							)
		// 						}
		// 					})
		// 					.catch(function(err) {
		// 						console.log('Unable to retrieve refreshed token ', err)
		// 					})
		// 			})
		//
		// 			/**
		// 			 *  Handle incoming messages. Called when:
		// 					  - a message is received while the app has focus
		// 					  - the user clicks on an app notification created by a sevice worker
		// 					    `firebaseMessaging.setBackgroundMessageHandler` handler.
		// 			 */
		// 			firebaseMessaging.onMessage(function(payload) {
		// 				console.log('received message ', payload)
		// 				var data = payload.data
		// 				if (data) {
		// 					var notificationPayload = {
		// 						'title': 'YouVersion',
		// 						'body': data.message,
		// 						'click_action': data.url,
		// 						'icon': '/apple-touch-icon.png'
		// 					}
		//
		// 					if (!('Notification' in window)) {
		// 					   console.log('This browser does not support system notifications')
		// 					} else if (Notification.permission === 'granted') {
		// 						var notification = new Notification(
		// 							notificationPayload.title,
		// 							notificationPayload
		// 						)
		// 						notification.onclick = function(event) {
		// 							event.preventDefault() // prevent the browser from focusing the Notification's tab
		// 							window.open(notificationPayload.click_action)
		// 							notification.close()
		// 						}
		// 					}
		// 				}
		// 			})
    //   })
    // } else {
    //   console.log('Browser doesn\'t support service worker.')
    // }
}


var isEvents            = isFirst("events");
var isTerms             = isFirst("terms");
var isPrivacy           = isFirst("privacy");
var isResetPassword     = isFirst("resetPassword");
var isReadingPlanSample = isFirst("reading-plans") && inPathNotFirst("day");
var isReader            = isFirst("bible");
var isTIORedirect       = isFirst("subscription");
var isReader            = isFirst("bible");
var isHomeFeed          = isFirst("moments") || isFirst("notes") || isFirst("highlights");
var isPlanIndex         = isFirst("reading-plans") && !inPathNotFirst("day");
var isPlanCollection    = isFirst("reading-plans-collection");
var isSignUp            = isFirst("sign-up");
var isSignIn            = isFirst("sign-in");
var isVOTD              = isFirst("verse-of-the-day");
var isPassage           = isFirst("passage");
var isExplore           = isFirst("explore");
var isSnapshot          = isFirst("snapshot");

var isLookInside        = isFirst("lookinside");
var isNotifications     = isFirst("notifications")

var isFriendsFeed       = isFirst("users") && inPathNotFirst("friends");
var isNotesFeed         = isFirst("users") && inPathNotFirst("notes");
var isBookmarksFeed     = isFirst("users") && inPathNotFirst("bookmarks");
var isHighlightsFeed    = isFirst("users") && inPathNotFirst("highlights");
var isImagesFeed        = isFirst("users") && inPathNotFirst("images");
var isBadgesFeed        = isFirst("users") && inPathNotFirst("badges");

var isUserReadingPlan   = isFirst("users") && (inPathNotFirst("reading-plans") || inPathNotFirst("saved-reading-plans") || inPathNotFirst("completed-reading-plans"));
var isUserProfile       = isFirst("users") && !isNotesFeed && !isHighlightsFeed && !isBookmarksFeed && !isImagesFeed && !isBadgesFeed && !isFriendsFeed;
