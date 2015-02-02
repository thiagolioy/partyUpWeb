
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');

// Controller code in separate files.
var adminCtrl = require('cloud/controllers/admin.js');
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
app.get('/admin', basicAuth, adminCtrl.index);
app.post('/party', basicAuth, partiesCtrl.create);
app.get('/parties', basicAuth, partiesCtrl.index);
app.get('/places', basicAuth, placesCtrl.index);


// Attach the Express app to Cloud Code.
app.listen();
