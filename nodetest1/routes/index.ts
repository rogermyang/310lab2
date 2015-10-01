/// <reference path='../types/DefinitelyTyped/node/node.d.ts'/>

/// <reference path='../types/DefinitelyTyped/express/express.d.ts'/> 

var express = require('express');

interface UserInterface {
    getName(): string;
    getEmail(): string;
}

class User implements UserInterface {

    constructor(private name: string, private email: string){}

    getName(): string {return this.name;}

    getEmail(): string {return this.email;}


}
class Router{
    public router: any;

    constructor(){
        var router = express.Router();
        this.router = router;

        /* GET home page. */
        router.get('/', function(req, res, next) {
            res.render('index', { title: 'Express' });
        });

        /* GET Hello World page. */
        router.get('/helloworld', function(req, res) {
            res.render('helloworld', { title: 'Hello, World!' });
        });

        /* GET Userlist page. */
        router.get('/userlist', function(req, res) {
            var db = req.db;
            var collection = db.get('usercollection');
            collection.find({},{},function(e,docs){
                res.render('userlist', {
                    "userlist" : docs
                });
            });
        });

        /* GET New User page. */
        router.get('/newuser', function(req, res) {
            res.render('newuser', { title: 'Add New User' });
        });

        /* POST to Add User Service */
        router.post('/adduser', function(req, res) {

            // Set our internal DB variable
            var db = req.db;

            // Get our form values. These rely on the "name" attributes
            var userName = req.body.username;
            var userEmail = req.body.useremail;
            var user = new User(userName, userEmail);

            // Set our collection
            var collection = db.get('usercollection');

            // Submit to the DB
            collection.insert({
                "username" : user.getName(),
                "email" : user.getEmail()
            }, function (err, doc) {
                if (err) {
                    // If it failed, return error
                    res.send("There was a problem adding the information to the database.");
                }
                else {
                    // And forward to success page
                    res.redirect("userlist");
                }
            });
        });
    }
}

export = Router;
