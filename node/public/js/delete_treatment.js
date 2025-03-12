// Citation for the following functions:
// Date: 3/5/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

function deleteTreatment(treatment_id) {
    // Put our data we want to send in a javascript object
    let data = {
        id: treatment_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-treatments-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(treatment_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(treatment_id){
    let table = document.querySelector("#display-table table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == treatment_id) {
            table.deleteRow(i);
            break;
       }
    }
}