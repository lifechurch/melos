angular.module('common.recentVersions', [])

    .factory('RecentVersions', function() {
        var key = "YouVersion:RecentVersions";
        var recentVersions = JSON.parse(localStorage.getItem(key)) || [];
        var max_versions = 4;

        function save() {
            localStorage.setItem(key, JSON.stringify(recentVersions));
        }

        return {
            all: function() {
                return recentVersions;
            },
            count: function() {
               return recentVersions.length;
            },
            add: function(version) {
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
    })
;