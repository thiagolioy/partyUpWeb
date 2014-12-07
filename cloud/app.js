
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');

// Controller code in separate files.
var adminController = require('cloud/controllers/admin.js');


var app = express();

// We will use HTTP basic auth to protect some routes (e.g. adding a new blog post)
var basicAuth = express.basicAuth('partyupAdmin','secretup');

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/admin', basicAuth, adminController.index);


// Attach the Express app to Cloud Code.
app.listen();
