(function (global) {
    
    var dom = window.document,
        nav = window.navigator,
        loc = window.location,

        couchCover = {
            'version': '0.0.1',

            'init': function (params) {
                var i;
                
                for (i in params) {
                    // Do not overwrite core couchCover methods/values!
                    if (!couchCover.hasOwnProperty(i)) {
                        couchCover[i] = params[i];
                    }
                }
            },
            
            'xhr': function (params, data, callback) {
                // Set XHR Object
                var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                
                // No XHR support
                if (!xhr) { return false; }
            
                // Add host to request URL
                params.url = couchCover.host + '/' + params.url;
                
                //Default to GET if no method is specified
                if (!params.method) { params.method = 'GET'; }
                
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 0) { // Uninitialized
                    
                    } else if (xhr.readyState === 1) { // Open
                        
                    } else if (xhr.readyState === 2) { // Sent
                        
                    } else if (xhr.readyState === 3) { // Receiving
                        
                    } else if (xhr.readyState === 4) { // Loaded
                        if (xhr.status === 200) {
                        
                            if (callback) {
                                callback(xhr);
                            } else {
                                return xhr;
                            }
                            
                            //console.log(xhr.getAllResponseHeaders());
                            //console.log(xhr.getResponseHeader('Etag'));
                            
                        }
                    } else { // The World Has Ended
                        return false;
                    }
                };
                
                xhr.open(params.method, params.url, true);
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(null);
            },
            
            'parse': function (params) {
            
            }
        };
            
    couchCover.database = {
        'create': function (params, callback) {
            
        },
        
        'delete': function (params, callback) {
            
        },
        
        'viewAll': function (params, callback) {
            couchCover.xhr({url: '_all_dbs'}, null, function(response) {
                if (callback) { callback(response.responseText); }
            });
        },
        
        'info': function (params, callback) {
            couchCover.xhr({url: params.url}, null, function (response) {
                if (callback) { callback(response.responseText); }
            });
        }
    };
        
    couchCover.doc = {
        'create': function (params, callback) {
            
        },
        
        'delete': function (params, callback) {
            
        },
        
        'update': function (params, callback) {
            
        },
        
        'get': function (params, callback) {
            var docURL = params.db + '/' + params.id;
            
            couchCover.xhr({url: docURL}, null, function (response) {
                if (callback) { callback(response.responseText); }
            });
        },
        
        'revision': function (params, callback) {
            var docURL = params.db + '/' + params.id;
            
            couchCover.xhr({url: docURL, method: 'HEAD'}, null, function (response) {
                if (callback) { callback(response.getResponseHeader('Etag')); }
            });
        }
    };
    
    window.couchCover = window.cc$ = couchCover;
    console.log('CouchCover ' + couchCover.version + ' initialized');
}(window));

couchCover.init({host: '/couchdb/'});

var ccDoc = cc$.doc.revision({db: 'host', id: 'b9df6033fcf31eb37af43cbd4b000550'}, function (response) {
    console.log(JSON.parse(response));
});