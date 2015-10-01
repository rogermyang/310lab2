/// <reference path='types/DefinitelyTyped/node/node.d.ts'/>
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", './routes/index'], function (require, exports) {
    /// <reference path='types/DefinitelyTyped/express/express.d.ts'/> 
    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var mongo = require('mongodb');
    var monk = require('monk');
    var Router = require('./routes/index');
    var Application = (function () {
        function Application() {
            var app = express();
            this.app = app;
            var db = monk('localhost:27017/nodetest1');
            this.db = db;
            this.router = new Router();
            // view engine setup
            app.set('views', path.join(__dirname, 'views'));
            app.set('view engine', 'jade');
            // uncomment after placing your favicon in /public
            //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
            app.use(logger('dev'));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(cookieParser());
            app.use(express.static(path.join(__dirname, 'public')));
            // Make our db accessible to our router
            app.use(function (req, res, next) {
                req.db = db;
                next();
            });
            // Make our db accessible to our router
            app.use('/', this.router.router);
            // catch 404 and forward to error handler
            app.use(function (req, res, next) {
                var err = new Error('Not Found');
                err.status = 404;
                next(err);
            });
            // error handlers
            // development error handler
            // will print stacktrace
            if (app.get('env') === 'development') {
                app.use(function (err, req, res, next) {
                    res.status(err.status || 500);
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                });
            }
            // production error handler
            // no stacktraces leaked to user
            app.use(function (err, req, res, next) {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: {}
                });
            });
        }
        return Application;
    })();
    exports.application = new Application();
});
