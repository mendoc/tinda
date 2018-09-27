const bodyParser = require('body-parser');
const fs         = require('fs');
const express    = require('express');
const nodemailer = require('nodemailer');

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

app.get('/mail', function(req, res) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'ssl0.ovh.net',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "dimitri@ecole241.org", // generated ethereal user
                pass: "OlaLabs241" // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Dimitri ONGOUA 👻" <dimitri@ecole241.org>', // sender address
            to: 'hlepa64@gmail.com, alex.mboungou@gmail.com', // list of receivers
            subject: 'Test Tinda', // Subject line
            text: 'Ceci est un mail de test envoyé via Tinda.', // plain text body
            html: '<b>Ceci est un mail de test envoyé via Tinda.</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
    //res.render('home.ejs', {floor: req.params.nom});
});

app.listen(3000, function () {
    console.log('Tinda app running at port 3000')
});