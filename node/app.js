// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();           // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 5555;                 // Set a port number at the top so it's easy to change in the future
// Database
var db = require('./database/db-connector')
// handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function(req, res)        
    {
        res.render('index', {is_patients: false});      
    });
    
app.get('/patients.hbs', function(req, res)        
    {
        res.render('patients', {is_patients: true});      
    });    

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});