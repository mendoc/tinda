const bodyParser = require('body-parser');
const fs         = require('fs');
const express    = require('express');
const session    = require('express-session');
const md5        = require('md5');
const tinda      = require('./tinda');
const constants  = require('./constants');
const db         = require('./db');

const app = express();

app.locals.base_url = constants.base_url;

app.use(session({secret: constants.session_key, saveUninitialized: true, resave: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(constants.public_dir));
app.use(function(req, res, next) {
    app.locals.us = req.session;
    next();
});
app.set('view engine', 'ejs');

var sess;

app.get('/', function (req, res) {
    res.render('home', {active : "home"});
});

app.get('/register', function (req, res) {
    res.render('register');
});
app.post('/register', (req, res) => {
    var name  = req.body.name;
    var email = req.body.email;
    var pass  = md5(req.body.pass);

    db.register([name, email, pass], function (err, result) {
        if (err) {
            res.redirect('register');
            sess.msg_error  = "Une erreur interne s'est produite.";
            console.error(err.stack);
        } else {
            console.log(result);
            res.redirect('login');
        }
    });
});

app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/login', function (req, res) {

    var email = req.body.email;
    var pass  = md5(req.body.pass);

    db.login([email, pass], function (err, result) {
        if (err) {
            res.redirect('login');
            sess.msg_error  = "Une erreur interne s'est produite.";
            console.error(err.stack);
        } else {
            sess = req.session;
            if (result.rowCount > 0){
                var user   = result.rows[0];
                sess.name  = user.name;
                sess.email = user.email;
                res.redirect('/');
            } else{
                sess.email_in   = email;
                sess.msg_error  = "Adresse email ou mot de passe incorrect.";
                res.redirect('login');
            }
        }
    });
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/list', function (req, res) {

    fs.readdir("lists/", function(err, items) {
        res.render('list', {addresses : items, active : "list"});
    });
});

app.post('/add_list', function (req, res) {
    var nom_list = req.body.nom_list;

    fs.open("lists/" + nom_list + '.txt', 'w', function (err, file) {
        if (err) {
            console.log(err);
            res.send({error : true});
        }else{
            console.log(file);
            res.send({error : false, liste : nom_list});
        }
    });
});

app.get('/home/:nom', function(req, res) {
    res.render('home.ejs', {floor: req.params.nom});
});

app.get('/mail', function(req, res) {

    var body = fs.readFileSync('public/birthday.html', 'utf8');

    var data = {
        from: constants.from,
        subject: "Tinda, la vision en marche",
        body: body
    };

    var dest = [
        "ongouadimitri5@gmail.com",
        "molakisiencyclopedie@gmail.com",
        "ongouadimitri5@yahoo.fr",
        "hlepa64@gmail.com"
    ];

    dest.forEach(function (email) {

        tinda.mail.send(data, email, function (err, info) {
            if (err) {
                console.log(err);
            }else{
                console.log(info.response);
                console.log(info.messageId);
                console.log(email);
                console.log("##################################");
            }
        });
    });

    res.render('list.ejs', {addresses : [], active : "list"});
});

app.listen(3000, function () {
    console.log('Tinda app running at port 3000')
});