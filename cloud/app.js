// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
// Controller code in separate files.
var partiesCtrl = require('cloud/controllers/parties.js');
var placesCtrl = require('cloud/controllers/places.js');


var app = express();

// We will use HTTP basic auth to protect some routes (e.g. adding a new blog post)
var basicAuth = express.basicAuth('partyupAdmin','secretup');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.post('/parties', basicAuth, partiesCtrl.create);
app.get('/parties/:id', basicAuth, partiesCtrl.show);
app.get('/parties/delete/:id', basicAuth, partiesCtrl.delete);
app.get('/parties', basicAuth, partiesCtrl.index);
app.get('/party', basicAuth, partiesCtrl.new);
app.get('/places', basicAuth, placesCtrl.index);
app.get('/place', basicAuth, placesCtrl.new);

//Privacy Police
app.get('/privacy', function(req, res) {
  res.render('dist/privacy_police');
})

app.get('/', function(req, res) {
  res.render('dist/landing');
})

// Attach the Express app to Cloud Code.
app.listen();
