define(['jquery'], function($){

    var SERVERS = ['http://carsxml.herokuapp.com', 'http://localhost:8081'],
        DEBUG = 0;


    return {
        getServerUrl: function(){
            return SERVERS[DEBUG];
        },

        getXML: function(url){
            return $.Deferred(function (defer) {
                $.ajax({
                    type: "GET",
                    url: SERVERS[DEBUG] + url,
                    dataType: "xml",
                    complete: function (res) {
                        defer.resolve(res.responseText);
                    }
                });
            });
        },

        post: function(url, xmlString){
            return $.Deferred(function(defer){
                $.ajax({
                    type: "POST",
                    url: SERVERS[DEBUG] + url,
                    processData: false,
                    dataType: 'text/xml',
                    data: xmlString,
                    success: function (response) {
                        //defer.resolve(response);
                    },
                    error: function (response) {
                        defer.resolve(response);
                    }
                });
            });
        }

    };
});