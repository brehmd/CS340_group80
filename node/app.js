// Citation for the following functions and routes:
// Date: 3/10/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();           // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 6001;                 // Set a port number at the top so it's easy to change in the future
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

// PATIENTS ---------------------------------------------------------------------------------------------------------------------------------------------
app.get('/patients.hbs', function(req, res)        
    {
        let query1;
        if (req.query.search_entry === undefined){
            query1 = "SELECT * FROM Patients;";
        }
        
        else{
            query1 = `SELECT * FROM Patients WHERE ${req.query.filter_attributes} LIKE "${req.query.search_entry}%"`
        }

        db.pool.query(query1, function(error, rows, fields){

            let patients = rows;

            res.render('patients', {is_patients: true, data: patients});               
        })
             
    });

app.get('/add_patients.hbs', function(req, res)        
    {
        res.render('add_patients', {is_patients: true}); 
    });

app.get('/update_patients.hbs', function(req, res)        
    {
        let patient_id = parseInt(req.query.patient_id);
        query1 = `SELECT * FROM Patients WHERE patient_id = ?`
        db.pool.query(query1, [patient_id], function(error, rows, fields){

            res.render('update_patients', {is_patients: true, data: rows[0]});                
        })
        
    });

app.post('/add_patients-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

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
            // If there was no error, perform a SELECT * on Patients
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

app.put('/put-patient-ajax', function(req, res, next) {
    let data = req.body;
    let patient_id = parseInt(data.patient_id);
    let age = parseInt(data.age);

    let query1 = `UPDATE Patients SET first_name = ?, last_name = ?, age = ?, phone_number = ?, esi_level = ? WHERE patient_id = ?`;

    // Run the query
    db.pool.query(query1, [data.first_name, data.last_name, age, data.phone_number, data.esi_level, patient_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

app.delete('/delete-patients-ajax/', function(req, res, next) {
    let data = req.body;
    let patient_id = parseInt(data.id);

    // Query to set patient_id to NULL in Appointments table
    let update_appointments = `UPDATE Appointments SET patient_id = NULL WHERE patient_id = ?`;

    // Query to delete from Patients_Treatments table
    let delete_patients_treatments = `DELETE FROM Patients_Treatments WHERE patient_id = ?`;

    // Query to delete from Patients table
    let delete_patients = `DELETE FROM Patients WHERE patient_id = ?`;

    // Run the 1st query to update Appointments table
    db.pool.query(update_appointments, [patient_id], function(error, rows, fields) {
        if (error) {
            // Log the error and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the 2nd query to delete from Patients_Treatments table
            db.pool.query(delete_patients_treatments, [patient_id], function(error, rows, fields) {
                if (error) {
                    // Log the error and send a 400 response
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Run the 3rd query to delete from Patients table
                    db.pool.query(delete_patients, [patient_id], function(error, rows, fields) {
                        if (error) {
                            // Log the error and send a 400 response
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // If everything is successful, send a 204 response
                            res.sendStatus(204);
                        }
                    });
                }
            });
        }
    });
});


// TREATMENTS ---------------------------------------------------------------------------------------------------------------------------------------------
app.get('/treatments.hbs', function(req, res)        
    {
        let query1;
        if (req.query.search_entry === undefined){
            query1 = "SELECT * FROM Treatments;";
        }
        
        else{
            if (req.query.filter_attributes == "description"){
                query1 = `SELECT * FROM Treatments WHERE ${req.query.filter_attributes} LIKE "${req.query.search_entry}%"`
            }
            if (req.query.filter_attributes == "min_cost"){
                query1 = `SELECT * FROM Treatments WHERE cost >= "${req.query.search_entry}%"`
            }
            if (req.query.filter_attributes == "max_cost"){
                query1 = `SELECT * FROM Treatments WHERE cost <= "${req.query.search_entry}%"`
            }
        }

        db.pool.query(query1, function(error, rows, fields){

            let treatments = rows;

            res.render('treatments', {is_treatments: true, data: treatments});               
        })
             
    });

app.get('/add_treatments.hbs', function(req, res)        
    {
        res.render('add_treatments', {is_treatments: true});
    });

app.get('/update_treatments.hbs', function(req, res)        
    {
        let treatment_id = parseInt(req.query.treatment_id);
        query1 = `SELECT * FROM Treatments WHERE treatment_id = ?`
        db.pool.query(query1, [treatment_id], function(error, rows, fields){

            res.render('update_treatments', {is_treatments: true, data: rows[0]});                
        })
        
    });


app.post('/add_treatments-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Treatments (description, cost) VALUES ('${data.description}', ${data.cost})`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Treatments
                let query2 = `SELECT * FROM Treatments;`;
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

app.put('/put-treatment-ajax', function(req, res, next) {
        let data = req.body;
        let treatment_id = parseInt(data.treatment_id);
        let cost = parseFloat(data.cost);
    
        let query1 = `UPDATE Treatments SET description = ?, cost = ? WHERE treatment_id = ?`
        // Run the query
        db.pool.query(query1, [data.description, cost, treatment_id], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });


app.delete('/delete-treatments-ajax/', function(req,res,next){
        let data = req.body;
        let treatment_id = parseInt(data.id);
        let delete_patients_treatments = `DELETE FROM Patients_Treatments WHERE treatment_id = ?`;
        let delete_treatments= `DELETE FROM Treatments WHERE treatment_id = ?`;
      
      
              // Run the 1st query
              db.pool.query(delete_patients_treatments, [treatment_id], function(error, rows, fields){
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  else
                  {
                      // Run the second query
                      db.pool.query(delete_treatments, [treatment_id], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.sendStatus(204);
                          }
                      })
                  }
})});

// DOCTORS ---------------------------------------------------------------------------------------------------------------------------------------------
app.get('/doctors.hbs', function(req, res)        
    {
        let query1;
        if (req.query.search_entry === undefined){
            query1 = "SELECT * FROM Doctors;";
        }
        
        else{
            query1 = `SELECT * FROM Doctors WHERE ${req.query.filter_attributes} LIKE "${req.query.search_entry}%"`
        }

        db.pool.query(query1, function(error, rows, fields){

            let doctors = rows;

            res.render('doctors', {is_doctors: true, data: doctors});               
        })
             
    });

app.get('/add_doctors.hbs', function(req, res)        
    {
        res.render('add_doctors', {is_doctors: true}); 
    });

app.get('/update_doctors.hbs', function(req, res)        
    {
        let doctor_id = parseInt(req.query.doctor_id);
        query1 = `SELECT * FROM Doctors WHERE doctor_id = ?`
        db.pool.query(query1, [doctor_id], function(error, rows, fields){

            res.render('update_doctors', {is_doctors: true, data: rows[0]});                
        })
        
    });

app.post('/add_doctors-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Doctors (first_name, last_name, specialization) VALUES ('${data.first_name}', '${data.last_name}', '${data.specialization}')`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Doctors
                query2 = `SELECT * FROM Doctors;`;
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

app.put('/put-doctor-ajax', function(req, res, next) {
        let data = req.body;
        let doctor_id = parseInt(data.doctor_id);
    
        let query1 = `UPDATE Doctors SET first_name = ?, last_name = ?, specialization = ? WHERE doctor_id = ?`;
    
        // Run the query
        db.pool.query(query1, [data.first_name, data.last_name, data.specialization, doctor_id], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

app.delete('/delete-doctors-ajax/', function(req, res, next) {
    let data = req.body;
    let doctor_id = parseInt(data.id);

    // Query to set doctor_id to NULL in Appointments table
    let update_appointments = `UPDATE Appointments SET doctor_id = NULL WHERE doctor_id = ?`;

    // Query to delete from Doctors_Departments table
    let delete_doctors_departments = `DELETE FROM Doctors_Departments WHERE doctor_id = ?`;

    // Query to delete from Doctors table
    let delete_doctors = `DELETE FROM Doctors WHERE doctor_id = ?`;

    // Run the 1st query to update Appointments table
    db.pool.query(update_appointments, [doctor_id], function(error, rows, fields) {
        if (error) {
            // Log the error and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the 2nd query to delete from Doctors_Departments table
            db.pool.query(delete_doctors_departments, [doctor_id], function(error, rows, fields) {
                if (error) {
                    // Log the error and send a 400 response
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Run the 3rd query to delete from Doctors table
                    db.pool.query(delete_doctors, [doctor_id], function(error, rows, fields) {
                        if (error) {
                            // Log the error and send a 400 response
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // If everything is successful, send a 204 response
                            res.sendStatus(204);
                        }
                    });
                }
            });
        }
    });
});
// APPOINTMENTS ----------------------------------------------------------------------------------------------------------------------------
app.get('/appointments.hbs', function(req, res) {
    let query1 = `
        SELECT 
            a.appointment_id,
            CONCAT(p.first_name, ' ', p.last_name) AS patient_full_name,
            CONCAT(d.first_name, ' ', d.last_name) AS doctor_full_name,
            dept.name AS department_name,
            a.appointment_date,
            a.appointment_time,
            a.reason
        FROM 
            Appointments a
        LEFT JOIN 
            Patients p ON a.patient_id = p.patient_id
        LEFT JOIN 
            Doctors d ON a.doctor_id = d.doctor_id
        JOIN 
            Departments dept ON a.department_id = dept.department_id;
    `;

    // Execute the query
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Format the appointment_date to only show the date portion (YYYY-MM-DD)
            rows.forEach(row => {
                if (row.appointment_date) {
                    row.appointment_date = row.appointment_date.toISOString().split('T')[0];
                }
            });

            // Pass the formatted data to the template
            res.render('appointments', {is_appointments: true, data: rows });
        }
    });
});

app.get('/add_appointments.hbs', function(req, res) {
    // Query to get all patients
    let query1 = "SELECT * FROM Patients;";

    // Query to get all doctors
    let query2 = "SELECT * FROM Doctors;";

    // Query to get all departments
    let query3 = "SELECT * FROM Departments;";

    // Execute the first query to get patients
    db.pool.query(query1, function(error, patients, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Execute the second query to get doctors
            db.pool.query(query2, function(error, doctors, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Execute the third query to get departments
                    db.pool.query(query3, function(error, departments, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Render the add_appointments.hbs template with patients, doctors, and departments data
                            res.render('add_appointments', {
                                is_appointments: true,
                                patients: patients,
                                doctors: doctors,
                                departments: departments
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/add_appointments-ajax', function(req, res) {
    let data = req.body;

    // Handle NULL values for patient_id and doctor_id
    let patient_id = data.patient_id === null ? null : parseInt(data.patient_id);
    let doctor_id = data.doctor_id === null ? null : parseInt(data.doctor_id);
    let department_id = parseInt(data.department_id);
    let appointment_date = data.appointment_date;
    let appointment_time = data.appointment_time;
    let reason = data.reason;

    // Create the query and run it on the database
    let query1 = `
        INSERT INTO Appointments (patient_id, doctor_id, department_id, appointment_date, appointment_time, reason)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.pool.query(query1, [patient_id, doctor_id, department_id, appointment_date, appointment_time, reason], function(error, rows, fields) {
        if (error) {
            console.log("Database error:", error); // Debugging: Log database errors
            res.sendStatus(400);
        } 
        else
        {
            // If there was no error, perform a SELECT * on Appointments to return the updated list
            let query2 = `SELECT * FROM Appointments;`;

            db.pool.query(query2, function(error, rows, fields) {
                // If there was an error on the second query, send a 400
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            });
        }
    });
});

app.delete('/delete-appointments-ajax', function(req, res) {
    let data = req.body;
    let appointment_id = parseInt(data.id);

    // Query to delete the appointment from the Appointments table
    let deleteQuery = `DELETE FROM Appointments WHERE appointment_id = ?`;

    // Execute the query
    db.pool.query(deleteQuery, [appointment_id], function(error, rows, fields) {
        if (error) {
            console.log("Database error:", error); // Debugging: Log database errors
            res.sendStatus(400); // Send a 400 error if something goes wrong
        } else {
            // If the deletion is successful, send a 204 status (No Content)
            res.sendStatus(204);
        }
    });
});

// DEPARTMENTS ---------------------------------------------------------------------------------------------------------------------------------------------
app.get('/departments.hbs', function(req, res)        
    {
        let query1;
        if (req.query.search_entry === undefined){
            query1 = "SELECT * FROM Departments;";
        }
        
        else{
            query1 = `SELECT * FROM Departments WHERE ${req.query.filter_attributes} LIKE "${req.query.search_entry}%"`
        }

        db.pool.query(query1, function(error, rows, fields){

            let departments = rows;

            res.render('departments', {is_departments: true, data: departments});               
        })
             
    });

app.get('/add_departments.hbs', function(req, res)        
    {
        res.render('add_departments', {is_departments: true}); 
    });

app.get('/update_departments.hbs', function(req, res)        
    {
        let department_id = parseInt(req.query.department_id);
        query1 = `SELECT * FROM Departments WHERE department_id = ?`
        db.pool.query(query1, [department_id], function(error, rows, fields){

            res.render('update_departments', {is_departments: true, data: rows[0]});                
        })
        
    });

app.post('/add_departments-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Departments (name, location) VALUES ('${data.name}', '${data.location}')`;
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
                query2 = `SELECT * FROM Departments;`;
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

app.put('/put-department-ajax', function(req, res, next) {
        let data = req.body;
        let department_id = parseInt(data.department_id);
    
        let query1 = `UPDATE Departments SET name = ?, location = ? WHERE department_id = ?`;
    
        // Run the query
        db.pool.query(query1, [data.name, data.location, department_id], function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
        });
    });

app.delete('/delete-departments-ajax/', function(req, res, next) {
    let data = req.body;
    let department_id = parseInt(data.id);

    // Query to delete from Appointments table
    let delete_appointments = `DELETE FROM Appointments WHERE department_id = ?`;

    // Query to delete from Doctors_Departments table
    let delete_doctors_departments = `DELETE FROM Doctors_Departments WHERE department_id = ?`;

    // Query to delete from Doctors table
    let delete_departments = `DELETE FROM Departments WHERE department_id = ?`;

    // Run the 1st query to delete Appointments table
    db.pool.query(delete_appointments, [department_id], function(error, rows, fields) {
        if (error) {
            // Log the error and send a 400 response
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the 2nd query to delete from Doctors_Departments table
            db.pool.query(delete_doctors_departments, [department_id], function(error, rows, fields) {
                if (error) {
                    // Log the error and send a 400 response
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Run the 3rd query to delete from Doctors table
                    db.pool.query(delete_departments, [department_id], function(error, rows, fields) {
                        if (error) {
                            // Log the error and send a 400 response
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // If everything is successful, send a 204 response
                            res.sendStatus(204);
                        }
                    });
                }
            });
        }
    });
});

// PATIENTS_TREATMENTS -----------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/patients_treatments.hbs', function(req, res) {
    let query1;
    let queryParams = []; // Array to hold query parameters

    if (req.query.search_entry === undefined || req.query.search_entry === "") {
        // Default query to show all rows (no search entry provided)
        query1 = `
            SELECT 
                Patients_Treatments.patient_treatment_id,
                Patients.first_name AS patient_first_name,
                Patients.last_name AS patient_last_name,
                Treatments.description AS treatment_description
            FROM 
                Patients_Treatments
            LEFT JOIN 
                Patients ON Patients_Treatments.patient_id = Patients.patient_id
            LEFT JOIN 
                Treatments ON Patients_Treatments.treatment_id = Treatments.treatment_id;
        `;
    } else {
        // Filter based on the selected attribute
        let filterAttribute = req.query.filter_attributes;
        let searchEntry = req.query.search_entry;

        if (filterAttribute === "p_name") {
            // Filter by patient's full name
            query1 = `
                SELECT 
                    Patients_Treatments.patient_treatment_id,
                    Patients.first_name AS patient_first_name,
                    Patients.last_name AS patient_last_name,
                    Treatments.description AS treatment_description
                FROM 
                    Patients_Treatments
                LEFT JOIN 
                    Patients ON Patients_Treatments.patient_id = Patients.patient_id
                LEFT JOIN 
                    Treatments ON Patients_Treatments.treatment_id = Treatments.treatment_id
                WHERE 
                    CONCAT(Patients.first_name, ' ', Patients.last_name) LIKE ?;
            `;
            queryParams.push(`%${searchEntry}%`); // Add wildcards for partial matching
        } else if (filterAttribute === "t_desc") {
            // Filter by treatment description
            query1 = `
                SELECT 
                    Patients_Treatments.patient_treatment_id,
                    Patients.first_name AS patient_first_name,
                    Patients.last_name AS patient_last_name,
                    Treatments.description AS treatment_description
                FROM 
                    Patients_Treatments
                LEFT JOIN 
                    Patients ON Patients_Treatments.patient_id = Patients.patient_id
                LEFT JOIN 
                    Treatments ON Patients_Treatments.treatment_id = Treatments.treatment_id
                WHERE 
                    Treatments.description LIKE ?;
            `;
            queryParams.push(`%${searchEntry}%`); // Add wildcards for partial matching
        }
    }

    // Execute the query
    db.pool.query(query1, queryParams, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('patients_treatments', {is_patients_treatments: true, data: rows });
        }
    });
});

app.get('/add_patients_treatments.hbs', function(req, res){
    // Query to get all patients
    let query1 = "SELECT * FROM Patients;";

    // Query to get all treatments
    let query2 = "SELECT * FROM Treatments;";

    // Run the first query to get patients
    db.pool.query(query1, function(error, patients, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the second query to get treatments
            db.pool.query(query2, function(error, treatments, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Render the template with patients and treatments data
                    res.render('add_patients_treatments', {is_patients_treatments: true, patients: patients, treatments: treatments });
                }
            });
        }
    });
});

app.get('/update_patients_treatments.hbs', function(req, res) {
    let patient_treatment_id = parseInt(req.query.patient_treatment_id);

    // Query to get the current Patients_Treatments entry
    let query1 = `
        SELECT 
            Patients_Treatments.patient_treatment_id,
            Patients_Treatments.patient_id,
            Patients_Treatments.treatment_id,
            Patients.first_name AS patient_first_name,
            Patients.last_name AS patient_last_name,
            Treatments.description AS treatment_description
        FROM 
            Patients_Treatments
        LEFT JOIN 
            Patients ON Patients_Treatments.patient_id = Patients.patient_id
        LEFT JOIN 
            Treatments ON Patients_Treatments.treatment_id = Treatments.treatment_id
        WHERE 
            Patients_Treatments.patient_treatment_id = ?;
    `;

    // Query to get all patients for the dropdown
    let query2 = "SELECT * FROM Patients;";

    // Query to get all treatments for the dropdown
    let query3 = "SELECT * FROM Treatments;";

    // Execute the first query to get the current Patients_Treatments entry
    db.pool.query(query1, [patient_treatment_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            let currentData = rows[0]; // Get the first row (current data)

            // Execute the second query to get all patients
            db.pool.query(query2, function(error, patients, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Execute the third query to get all treatments
                    db.pool.query(query3, function(error, treatments, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Render the update form with the current data, patients, and treatments
                            res.render('update_patients_treatments', {
                                is_patients_treatments: true,
                                data: currentData,
                                patients: patients,
                                treatments: treatments
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/add_patients_treatments-ajax', function(req, res) {
    let data = req.body;

    // Handle NULL values for patient_id
    let patient_id = data.patient_id === null ? null : parseInt(data.patient_id);
    let treatment_id = parseInt(data.treatment_id);

    // Create the query and run it on the database
    let query1 = `INSERT INTO Patients_Treatments (patient_id, treatment_id) VALUES (?, ?)`;
    db.pool.query(query1, [patient_id, treatment_id], function(error, rows, fields) {
        if (error) {
            console.log("Database error:", error); // Debugging: Log database errors
            res.sendStatus(400);
        } 
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            let query2 = `SELECT * FROM Patients_Treatments;`;
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
    });
});

app.put('/put-patient-treatment-ajax', function(req, res) {
    let data = req.body;

    // Extract the data from the request body
    let patient_treatment_id = parseInt(data.patient_treatment_id);
    let patient_id = data.patient_id === "NULL" ? null : parseInt(data.patient_id);
    let treatment_id = parseInt(data.treatment_id);

    // Query to update the Patients_Treatments entry
    let query = `
        UPDATE Patients_Treatments 
        SET 
            patient_id = ?, 
            treatment_id = ?
        WHERE 
            patient_treatment_id = ?;
    `;

    // Execute the query
    db.pool.query(query, [patient_id, treatment_id, patient_treatment_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204); // Success, no content to send back
        }
    });
});

app.delete('/delete-patients-treatments-ajax/', function(req,res,next){
    let data = req.body;
    let patient_treatment_id = parseInt(data.id);
    let delete_patients_treatments = `DELETE FROM Patients_Treatments WHERE patient_treatment_id = ?`;
  
          // Run the 1st query
          db.pool.query(delete_patients_treatments, [patient_treatment_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }

              else
              {
                res.sendStatus(204);
              }
})});

// DOCTORS_DEPARTMENTS ---------------------------------------------------------------------------------------------------------------
app.get('/doctors_departments.hbs', function(req, res) {
    let query1;
    let queryParams = []; // Array to hold query parameters

    if (req.query.search_entry === undefined || req.query.search_entry === "") {
        // Default query to show all rows (no search entry provided)
        query1 = `
            SELECT 
                Doctors_Departments.doctor_department_id,
                Doctors.first_name AS doctor_first_name,
                Doctors.last_name AS doctor_last_name,
                Departments.name AS department_name
            FROM 
                Doctors_Departments
            LEFT JOIN 
                Doctors ON Doctors_Departments.doctor_id = Doctors.doctor_id
            LEFT JOIN 
                Departments ON Doctors_Departments.department_id = Departments.department_id;
        `;
    } else {
        // Filter based on the selected attribute
        let filterAttribute = req.query.filter_attributes;
        let searchEntry = req.query.search_entry;

        if (filterAttribute === "doctor_name") {
            // Filter by doctor's full name
            query1 = `
                SELECT 
                    Doctors_Departments.doctor_department_id,
                    Doctors.first_name AS doctor_first_name,
                    Doctors.last_name AS doctor_last_name,
                    Departments.name AS department_name
                FROM 
                    Doctors_Departments
                LEFT JOIN 
                    Doctors ON Doctors_Departments.doctor_id = Doctors.doctor_id
                LEFT JOIN 
                    Departments ON Doctors_Departments.department_id = Departments.department_id
                WHERE 
                    CONCAT(Doctors.first_name, ' ', Doctors.last_name) LIKE ?;
            `;
            queryParams.push(`%${searchEntry}%`); // Add wildcards for partial matching
        } else if (filterAttribute === "department_name") {
            // Filter by department name
            query1 = `
                SELECT 
                    Doctors_Departments.doctor_department_id,
                    Doctors.first_name AS doctor_first_name,
                    Doctors.last_name AS doctor_last_name,
                    Departments.name AS department_name
                FROM 
                    Doctors_Departments
                LEFT JOIN 
                    Doctors ON Doctors_Departments.doctor_id = Doctors.doctor_id
                LEFT JOIN 
                    Departments ON Doctors_Departments.department_id = Departments.department_id
                WHERE 
                    Departments.name LIKE ?;
            `;
            queryParams.push(`%${searchEntry}%`); // Add wildcards for partial matching
        }
    }

    // Execute the query
    db.pool.query(query1, queryParams, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.render('doctors_departments', {is_doctors_departments: true, data: rows });
        }
    });
});

app.get('/add_doctors_departments.hbs', function(req, res){
    // Query to get all Doctors
    let query1 = "SELECT * FROM Doctors;";

    // Query to get all Departments
    let query2 = "SELECT * FROM Departments;";

    // Run the first query to get doctors
    db.pool.query(query1, function(error, doctors, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Run the second query to get departments
            db.pool.query(query2, function(error, departments, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Render the template with doctors and departments data
                    res.render('add_doctors_departments', {is_doctors_departments: true, doctors: doctors, departments: departments });
                }
            });
        }
    });
});

app.get('/update_doctors_departments.hbs', function(req, res) {
    let doctor_department_id = parseInt(req.query.doctor_department_id);

    // Query to get the current Doctors_Departments entry
    let query1 = `
        SELECT 
            Doctors_Departments.doctor_department_id,
            Doctors_Departments.doctor_id,
            Doctors_Departments.department_id,
            Doctors.first_name AS doctor_first_name,
            Doctors.last_name AS doctor_last_name,
            Departments.name AS department_name
        FROM 
            Doctors_Departments
        LEFT JOIN 
            Doctors ON Doctors_Departments.doctor_id = Doctors.doctor_id
        LEFT JOIN 
            Departments ON Doctors_Departments.department_id = Departments.department_id
        WHERE 
            Doctors_Departments.doctor_department_id = ?;
    `;

    // Query to get all doctors for the dropdown
    let query2 = "SELECT * FROM Doctors;";

    // Query to get all departments for the dropdown
    let query3 = "SELECT * FROM Departments;";

    // Execute the first query to get the current Doctors_Departments entry
    db.pool.query(query1, [doctor_department_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            let currentData = rows[0]; // Get the first row (current data)

            // Execute the second query to get all doctors
            db.pool.query(query2, function(error, doctors, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    // Execute the third query to get all departments
                    db.pool.query(query3, function(error, departments, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            // Render the update form with the current data, doctors, and departments
                            res.render('update_doctors_departments', {
                                is_doctors_departments: true,
                                data: currentData,
                                doctors: doctors,
                                departments: departments
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/add_doctors_departments-ajax', function(req, res) {
    let data = req.body;

    let doctor_id = parseInt(data.doctor_id);
    let department_id = parseInt(data.department_id);

    // Create the query and run it on the database
    let query1 = `INSERT INTO Doctors_Departments (doctor_id, department_id) VALUES (?, ?)`;
    db.pool.query(query1, [doctor_id, department_id], function(error, rows, fields) {
        if (error) {
            console.log("Database error:", error); // Debugging: Log database errors
            res.sendStatus(400);
        } 
        else
        {
            // If there was no error, perform a SELECT * on Doctors_Departments
            let query2 = `SELECT * FROM Doctors_Departments;`;
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
    });
});

app.put('/put-doctor-department-ajax', function(req, res) {
    let data = req.body;

    // Extract the data from the request body
    let doctor_department_id = parseInt(data.doctor_department_id);
    let doctor_id = parseInt(data.doctor_id);
    let department_id = parseInt(data.department_id);

    // Query to update the Doctors_Departments entry
    let query = `
        UPDATE Doctors_Departments 
        SET 
            doctor_id = ?, 
            department_id = ?
        WHERE 
            doctor_department_id = ?;
    `;

    // Execute the query
    db.pool.query(query, [doctor_id, department_id, doctor_department_id], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204); // Success, no content to send back
        }
    });
});

app.delete('/delete-doctors-departments-ajax/', function(req,res,next){
    let data = req.body;
    let doctor_department_id = parseInt(data.id);
    let delete_doctors_departments = `DELETE FROM Doctors_Departments WHERE doctor_department_id = ?`;
  
          // Run the 1st query
          db.pool.query(delete_doctors_departments, [doctor_department_id], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }

              else
              {
                res.sendStatus(204);
              }
})});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});