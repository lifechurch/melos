angular.module('common.recentVersions', [])

    .factory('RecentVersions', function() {
        var key = "YouVersion:RecentVersions";
        var recentVersions = JSON.parse(localStorage.getItem(key)) || [];
        var max_versions = 4;

        function save() {
            localStorage.setItem(key, JSON.stringify(recentVersions));
        }

        function contains(version) {
            for(var x = 0; x < recentVersions.length; x++) {
                var v = recentVersions[x];
                if (v.id == version.id) {
                    return true;
                }
            }
            return false;
        }

        return {
            all: function() {
                return recentVersions;
            },
            count: function() {
               return recentVersions.length;
            },
            add: function(version) {
                if (contains(version) == false) {
                    recentVersions.push(version);
                    if (recentVersions.length > max_versions) {
                        var removeCount = recentVersions.length - max_versions;
                        for (var x = 0; x < removeCount; x++) {
                            recentVersions.shift();
                        }
                    }
                    save();
                }
            }
        }
    })
;