require.config({
    paths: {
    	// Major libraries
        jquery: 'libs/jquery-2.1.0',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        gmaps: 'app/googleMapsLoader',

        // Require.js plugins
        text: 'libs/text',

        //  Shortcuts
        html: '../html/',
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
    }
});

require(['app/router', 'app/config', 'gmaps'], function(Router, Config, GoogleMapsLoader) {
    GoogleMapsLoader.done(function(){
       Router.init();

     }).fail(function(){ 
       console.error("ERROR: Google maps library failed to load");
     });
});