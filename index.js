"use strict";

var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');

var layout      = require("express-layout");
var bodyParser  = require("body-parser");
var express     = require("express");
var session     = require("express-session");
var flash       = require("connect-flash"); 
var bcrypt      = require("bcrypt-nodejs");
var app         = express();

app.use( express.static('public') );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( layout() );
app.set( "layouts", "./views/layouts" );
app.set( "layout", "def" ); 
app.use( session({
        secret: "liteshop",
        resave: false,
        saveUninitialized: false
}));
app.use(flash());
app.set( "view engine", "jade" );
app.set( "dbName",  "liteshop" );

app.use( function ( req, res, next ){
        res.renderAdmin = function ( view, locals, cb ){
                var that = this;
                if ( locals.layout === undefined ){
                        locals.layout = "admin";
                }
                that.render.apply( that, arguments );
                return true;
        }
        next();
});
app.use( function ( req, res, next ){
        if ( req.session.user ){
                res.locals.user = req.session.user;
        }
        next();
});
app.use( function ( req, res, next ){
        var msgs = req.flash();
        var msgsExs = Object.keys(msgs).length;
        if ( msgsExs ){
                res.locals.msgs = msgs;
        };
        next();
});

app.get( "/", function ( req, res ){
        var Product = require( "./models/product" );
        mongoose.connect("localhost:27017/" + app.get("dbName"));
        Product.find( function ( err, docs ){
                if ( err ){
                        console.log( "database error" );
                        mongoose.disconnect();
                        return false;
                }
                res.render( "index" , {
                        "title"         : "LiteShop",
                        "heading"       : "LiteShop App",
                        "products"      : docs      
                });
                mongoose.disconnect();
        });
})

app.get( "/user/signup", function ( req, res ){
        res.render( "user/signup" );
});

app.post( "/user/signupreq", function ( req, res ){
        var User = require( "./models/user" );
        var pwdHash = bcrypt.hashSync( req.body.user.pwd );
        var newUser = new User ({
                "login" : req.body.user.login,
                "email" : req.body.user.email,
                "pwd"   : pwdHash,
                "role"  : "user"
        });
        mongoose.connect("localhost:27017/" + app.get("dbName"));
        User.find({
                "login" : req.body.user.login
        }, function (err, docs){
                if ( err ){
                        mongoose.disconnect();
                        req.flash( "danger", "Database error" );
                        res.redirect( "/user/signup" );
                        return false;
                }
                if ( docs.length ){
                        mongoose.disconnect();
                        req.flash( "warning", "login is already in use" );
                        res.redirect( "/user/signup" );
                        return false;
                }
                newUser.save(function (err){
                        if ( err ){
                                mongoose.disconnect();
                                req.flash( "danger", "Cannot save data" ),
                                res.redirect( "/user/signup" );
                        }else{
                                mongoose.disconnect();
                                req.flash( "success", "Welcome to our store,  " + req.body.user.login );
                                req.session.user = newUser;
                                res.redirect( "/user/profile" );
                        }
                });
        });
});

app.get( "/user/signin", function ( req, res ){
        res.render( "user/signin" );
});
app.post( "/user/signinreq", function ( req, res ){
        var User = require( "./models/user" );
        mongoose.connect("localhost:27017/" + app.get("dbName"));
        User.findOne({
                "login" : req.body.user.login
        },
        function (err, user){
                mongoose.disconnect();
                if ( err ){
                        req.flash( "danger", "Database error" );
                        res.redirect( "/user/signin" );
                        return false;
                }
                if ( !user ){
                        req.flash( "warning", "Invalid login" );
                        res.redirect( "/user/signin" );
                        return false;
                }
                bcrypt.compare( req.body.user.pwd, user.pwd, function ( err, r ){
                        if ( err ){
                                req.flash( "danger", err );
                                res.redirect( "/user/signin" );
                                return false;
                        }
                        if ( !r ){
                                req.flash( "warning", "Invalid password" );
                                res.redirect( "/user/signin" );
                                return false;
                        }
                        req.flash("success", "Hello " + req.body.user.login + "!");
                        req.session.user = user;
                        res.redirect( "/user/profile" );
                });
        });
});

app.get( "/user/signoutreq", function ( req, res ){
        req.session.user = undefined;
        res.redirect( req.headers.referer );      
});

app.get( "/user/profile", function ( req, res ){
        if ( req.session.user === undefined ){
                res.redirect( "/" );
        }else{
                res.render( "user/profile" );
        }
});

app.get( "/admin", function ( req, res ){
        var locals = {
                "section":      "products",
                "title":        "Products"               
        };
        var Product = require( "./models/product" );
        mongoose.connect("localhost:27017/" + app.get("dbName"));
        mongoose.disconnect();        
        // res.renderAdmin( "partials/admin-products", {
        //         "section":      "products",
        //         "title":        "Products"
        // });
});


/*app.get( "/hello", function ( req, res ){
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
});*/

var server = app.listen( 8080, function(){
})
