// Citation for the following functions:
// Date: 3/7/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

document.getElementById('confirm-button').addEventListener('click', function() {
    // Gather the data from the form
    let treatment_id = document.getElementById('treatment_id').value;
    let description = document.getElementById('description').value;
    let cost = document.getElementById('cost').value;

    // Get the previous values from the row above
    let prev_desc = document.getElementById('prev_desc').textContent;
    let prev_cost = document.getElementById('prev_cost').textContent;

    // Use previous values if the input fields are empty
    if (!description) {
        description = prev_desc;
    }
    if (!cost) {
        cost = prev_cost;
    }

    if (description == "NULL" || cost == "NULL") {
        // Display an error message
        alert('All fields are required. Please fill in all the fields before submitting.');
        return; // Stop the function execution if any field is empty
    }

    // Check if the cost is negative
    if (costValue < 0) {
        alert('Cost cannot be negative. Please enter a non-negative value.');
        return; // Stop the function execution if the cost is negative
    }

    // Create a JavaScript object to hold the data
    let data = {
        treatment_id: treatment_id,
        description: description,
        cost: cost
    };

    // Send the data to the server using an AJAX PUT request
    fetch('/put-treatment-ajax', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 204) {
            // If the update was successful, redirect to the treatments page
            window.location.href = '/treatments.hbs';
        } else {
            console.error('Error updating treatment');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('cancel-button').addEventListener('click', function() {
    // Redirect to the treatments page if the user cancels
    window.location.href = '/treatments.hbs';
});