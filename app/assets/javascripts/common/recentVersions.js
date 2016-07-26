angular.module('common.recentVersions', [])

    .factory('RecentVersions', ['RailsHttp', function(RailsHttp) {
        var key = "YouVersion:RecentVersions";
        var recentVersions = JSON.parse(localStorage.getItem(key)) || [];
        var serverVersions = [];
        var max_versions = 5;
        var lastSync = JSON.parse(localStorage.getItem(key + ":LastSync")) || null;
        var isLoggedIn = false;

        function save() {
            localStorage.setItem(key, JSON.stringify(recentVersions));
        }

        function saveSyncDate(d) {
            if (typeof d !== 'undefined') {
                lastSync = d;
                localStorage.setItem(key + ":LastSync", JSON.stringify(d));
            }
        }

        function syncToServer() {
            if (isLoggedIn) {
                RailsHttp.get('/getSettings', false).then(function (res) {
                    serverSyncDate = null;

                    if (res && res.data && res.data.settings && res.data.settings.bible && res.data.settings.bible.recent_versions && res.data.settings.bible.recent_versions.length >= 0) {
                        serverVersions = res.data.settings.bible.recent_versions;
                    }

                    if (res && res.data && res.data.updated_dt) {
                        serverSyncDate = res.data.updated_dt;
                    }

                    // If we have no local versions saved, assume
                    // server is source of truth and update local
                    if (recentVersions.length == 0) {
                        updateLocal(serverVersions, serverSyncDate);

                        // If we have no server versions saved, assume
                        // local is source of truth and update server
                    } else if (serverVersions.length == 0) {
                        updateServer(recentVersions);

                        // Both server and local have versions, so
                        // check last sync dates
                    } else {

                        // Local has most recent update, so update server
                        if (lastSync && lastSync > serverSyncDate) {
                            updateServer(recentVersions);

                            // Server has most recent update, so update local
                        } else {
                            updateLocal(serverVersions, serverSyncDate);

                        }
                    }
                });
            }
        }

        function updateServer(versions) {
            if (isLoggedIn) {
                newVersions = versions.map(function (v) {
                    if (typeof v === 'object' && typeof v.id !== 'undefined') {
                        return v.id
                    } else if (!isNaN(v)) {
                        return v;
                    } else {
                        return 0;
                    }
                });

                RailsHttp.post('/updateSettings', 'recent_versions', null, newVersions).then(function (res) {
                    serverVersions = newVersions;
                    saveSyncDate(res.data.updated_dt);
                });
            }
        }

        function updateLocal(versions, lastSyncDate) {
            recentVersions = versions;
            save();
            saveSyncDate(lastSyncDate);
        }

        return {
            all: function() {
                return recentVersions.map(function(v) {
                   if (typeof v === 'object' && typeof v.id !== 'undefined') {
                       return v.id;
                   } else if (!isNaN(v)) {
                       return v;
                   }
                });
            },
            count: function() {
               return recentVersions.length;
            },
            add: function(version) {
                if (recentVersions.indexOf(version) == -1) {
                    recentVersions.push(version);
                    if (recentVersions.length > max_versions) {
                        recentVersions = recentVersions.slice(-1 * max_versions);
                    }
                    save();
                    updateServer(recentVersions);
                }
            },
            sync: function() {
                syncToServer();
            },
            setLoggedInState: function(status) {
                isLoggedIn = status;
                if (status) {
                    syncToServer();
                }
            }
        }
    }])
;