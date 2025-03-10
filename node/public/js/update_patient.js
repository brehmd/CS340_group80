// Citation for the following functions:
// Date: 3/2/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

document.getElementById('confirm-button').addEventListener('click', function() {
    // Gather the data from the form
    let patient_id = document.getElementById('patient_id').value;
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let age = document.getElementById('age').value;
    let phone_number = document.getElementById('phone_number').value;
    let esi_level = document.getElementById('esi_level').value;

    // Get the previous values from the row above
    let prev_first_name = document.getElementById('prev_fname').textContent;
    let prev_last_name = document.getElementById('prev_lname').textContent;
    let prev_age = document.getElementById('prev_age').textContent;
    let prev_phone_number = document.getElementById('prev_pn').textContent;
    let prev_esi_level = document.getElementById('prev_esi').textContent;

    // Use previous values if the input fields are empty
    if (!first_name) {
        first_name = prev_first_name;
    }
    if (!last_name) {
        last_name = prev_last_name;
    }
    if (!age) {
        age = prev_age;
    }
    if (!phone_number) {
        phone_number = prev_phone_number;
    }
    if (!esi_level) {
        esi_level = prev_esi_level;
    }

    const phone_pattern = /^\d{3}-\d{4}$/;
    if (!phone_pattern.test(phone_number)) {
        alert('Please enter a valid phone number in the format 000-0000.');
        return; // Stop further execution if the phone number is invalid
    }

    if (first_name == "NULL" || last_name == "NULL" || age == "NULL" || phone_number == "NULL" || esi_level == "NULL") {
        // Display an error message
        alert('All fields are required. Please fill in all the fields before submitting.');
        return; // Stop the function execution if any field is empty
    }

    // Create a JavaScript object to hold the data
    let data = {
        patient_id: patient_id,
        first_name: first_name,
        last_name: last_name,
        age: age,
        phone_number: phone_number,
        esi_level: esi_level
    };

    // Send the data to the server using an AJAX PUT request
    fetch('/put-patient-ajax', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 204) {
            // If the update was successful, redirect to the patients page
            window.location.href = '/patients.hbs';
        } else {
            console.error('Error updating patient');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('cancel-button').addEventListener('click', function() {
    // Redirect to the patients page if the user cancels
    window.location.href = '/patients.hbs';
});