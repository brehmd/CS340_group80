// Citation for the following functions:
// Date: 3/6/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

document.getElementById('confirm-button').addEventListener('click', function() {
    // Gather the data from the form
    let department_id = document.getElementById('department_id').value; // Retrieve department_id from hidden input
    let name = document.getElementById('name').value;
    let location = document.getElementById('location').value;

    // Get the previous values from the row above
    let prev_name = document.getElementById('prev_name').textContent;
    let prev_loc = document.getElementById('prev_loc').textContent;

    // Use previous values if the input fields are empty
    if (!name) {
        name = prev_name;
    }
    if (!location) {
        location = prev_loc;
    }

    if (name == "NULL" || location == "NULL") {
        // Display an error message
        alert('All fields are required. Please fill in all the fields before submitting.');
        return; // Stop the function execution if any field is empty
    }

    // Create a JavaScript object to hold the data
    let data = {
        department_id: department_id,
        name: name,
        location: location
    };

    // Send the data to the server using an AJAX PUT request
    fetch('/put-department-ajax', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 204) {
            // If the update was successful, redirect to the departments page
            window.location.href = '/departments.hbs';
        } else {
            console.error('Error updating department');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});