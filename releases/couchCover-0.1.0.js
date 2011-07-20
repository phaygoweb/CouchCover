/*
 *  Developer: Kyle A. Matheny
 */

(function (global) {

    var couchCover = {
        'version': '0.1.0',

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
            // Set XHR object
            var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            
            // No XHR support
            if (!xhr) { return false; }
        
            // Add host to request URL
            params.url = couchCover.host + '/' + params.url;
            
            //Default to GET if no method is specified
            if (typeof params.method == 'undefined') { params.method = 'GET'; }
            
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) { // Loaded
                    if (xhr.status === 200) {
                    
                        if (callback) {
                            callback(xhr);
                        } else {
                            return xhr;
                        }
                        
                    }
                }
            };
            
            xhr.open(params.method, params.url, true);
            
            // PUT and POST Headers
            if (params.method === 'PUT' || params.method === 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
            
            // Send with data, if available, otherwise null
            if (data !== '') {
                xhr.send(data);
            } else {
                xhr.send(null);
            }
        }
        
    };
            
    couchCover.database = {
        'create': function (params, callback) {
            couchCover.xhr({url: params.db, method: 'PUT'}, null, function (response) {
                if (callback) { callback(response.responseText); }
            });
        },
        
        'delete': function (params, callback) {
            couchCover.xhr({url: params.db, method: 'DELETE'}, null, function (response) {
                if (callback) { callback(response.responseText); }
            });
        },
        
        'viewAll': function (params, callback) {
            couchCover.xhr({url: '_all_dbs'}, null, function (response) {
                if (callback) { callback(response.responseText); }
            });
        },
        
        'view': function (params, callback) {
            couchCover.xhr({url: params.db}, null, function (response) {
                if (callback) { callback(response.responseText); }
            });
        }
    };
        
    couchCover.doc = {
        'create': function (params, data, callback) {
            // If no docId is provided, generate a UUID
            if (!params.docId) {
                console.error('No docId provided, need to generate a UUID.');
            }
        
            var docURL = params.db + '/' + params.docId;
            
            couchCover.xhr({url: docURL, method: 'PUT'}, data, function (response) {
                if (callback) { callback(response.responseText); }
            });
        },
        
        'delete': function (params, callback) {
            var docURL = params.db + '/' + params.docId;
            
            // Is revision number provided?
            if (params.docRev) {
                docURL += '?rev=' + params.docRev;
            } else {
                // Get current document revision number
                couchCover.doc.revision({db: params.db, docId: params.docId}, function (response) {
                    docURL += '?rev=' + response;
                    
                    couchCover.xhr({url: docURL, method: 'DELETE'}, null, function (response) {
                        if (callback) { callback(response.responseText); }
                    });
                });
            }
            
        },
        
        'addField': function (params, data, callback) {
            var docURL = params.db + '/' + params.docId,
                tempData = JSON.parse(data);

            // If _rev isn't included in data
            if (!tempData._rev) {
                // Get latest revision and update using that document
                couchCover.doc.revision(params, function (response) {
                    tempData._rev = response;
                    data = JSON.stringify(tempData);
                    
                    couchCover.xhr({url: docURL, method: 'PUT'}, data, function (response) {
                        if (callback) { callback(response.responseText); }
                    });
                    
                });
            } else {
                couchCover.xhr({url: docURL, method: 'PUT'}, data, function (response) {
                    if (callback) { callback(response.responseText); }
                });
            }
        },
        
        'removeField': function (params, callback) {
            var docURL = params.db + '/' + params.docId;
            
            couchCover.xhr({url: docURL}, null, function (response) {
                var docData = JSON.parse(response.responseText),
                    removeFields = params.remove.split(','),
                    len = removeFields.length,
                    i = 0;
                
                for (i = 0; i < len; i++) {
                    // Remove any leading and trailing whitespace
                    removeFields[i] = removeFields[i].replace(/^(\s)/i, '').replace(/(\s)$/i, '');
                    
                    delete docData[removeFields[i]];
                }
                
                couchCover.xhr({url: docURL, method: 'PUT'}, JSON.stringify(docData), function (response) {
                    if (callback) { callback(response.responseText); }
                });
            });
        },
        
        'view': function (params, callback) {
            var docURL = params.db + '/' + params.docId;
            
            couchCover.xhr({url: docURL}, null, function (response) {
                if (callback) { callback(response.responseText); }
            });
        },
        
        'revision': function (params, callback) {
            var docURL = params.db + '/' + params.docId;
            
            couchCover.xhr({url: docURL, method: 'HEAD'}, null, function (response) {
                // Drop the quotation marks and then call callback
                if (callback) { callback(response.getResponseHeader('Etag').replace(/"/gi, '')); }
            });
        }
    };
    
    window.couchCover = window.cc$ = couchCover;
    console.log('CouchCover ' + couchCover.version + ' initialized');
}(window));