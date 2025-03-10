// Citation for the following functions:
// Date: 3/8/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

function deleteAppointment(appointment_id) {
    // Put our data we want to send in a JavaScript object
    let data = {
        id: appointment_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-appointments-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // If the deletion was successful, remove the row from the table
            deleteRow(appointment_id);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    // Reload the page to reflect the changes
    location.reload();
}

function deleteRow(appointment_id) {
    let table = document.getElementById("display-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        // Check if the row's data-value matches the appointment_id
        if (table.rows[i].getAttribute("data-value") == appointment_id) {
            // Delete the row from the table
            table.deleteRow(i);
            break;
        }
    }
}