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
        let query1 = "SELECT * FROM Patients;";
        db.pool.query(query1, function(error, rows, fields){

            res.render('patients', {is_patients: true, data: rows});               
        })
             
    });

app.get('/add_patients.hbs', function(req, res)        
    {
        res.render('add_patients', {is_patients: true}); 
    });

// app.js - ROUTES section

app.post('/add_patients-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // // Capture NULL values
    // let esi_level = parseInt(data.esi_level);
    // if (isNaN(esi_level))
    // {
    //     esi_level = 'NULL' //does this need to be NULL??
    // }

    // Create the query and run it on the database
    query1 = `INSERT INTO Patients (first_name, last_name, age, phone_number, esi_level) VALUES ('${data.first_name}', '${data.last_name}', ${data.age}, '${data.phone_number}', '${data.esi_level}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Patients;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});