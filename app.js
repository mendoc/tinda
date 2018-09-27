const bodyParser = require('body-parser');
const fs         = require('fs');
const express    = require('express');

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('home', {active : "home"});
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/login', function (req, res) {
    res.redirect('/');
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

app.listen(3000, function () {
    console.log('Tinda app running at port 3000')
});