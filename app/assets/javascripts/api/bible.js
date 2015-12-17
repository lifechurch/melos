angular.module("api.bible", [])

.factory('Bible', ['RailsHttp', function(RailsHttp) {
    function fixVerseRange(usfm) {
        usfm = angular.copy(usfm);
        if (typeof usfm == 'object' && usfm.length && usfm.length > 1) {
            return usfm.shift() + '-' + usfm.pop().split('.')[2];
        } else {
            return usfm;
        }
    }

	return {
		getChapter: function(path) {
			return RailsHttp.get(path, true);
		},
		getVerse: function(usfm, version) {
            usfm = fixVerseRange(usfm);
			var url = "/bible/" + version + "/" + usfm + ".json";
			return RailsHttp.get(url, true);
		},
        fixVerseRange: function(usfm) {
            return fixVerseRange(usfm);
        }
	};
}])

;
