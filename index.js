"use strict";

var express = require("express");
var app = express();

app.use( express.static('public') );
app.set( "view engine", "jade" ); 

app.get( "/", function ( req, res ){
        res.render( "index" , {
		"title" 	: "LightShop",
	 	"heading" 	: "LightShop App"	
	} );
})

app.get( "/hello", function ( req, res ){
        res.render( "index" , {
                "title"         : "Hello",
                "heading"       : "Hello World!"
        } );
});

app.get( "/bye", function ( req, res ){
        res.render( "index" , {
                "title"         : "Bye",
                "heading"       : "Good Bye World!"
        } );
});

var server = app.listen( 8080, function(){
	console.log("hello");
})
