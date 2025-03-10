// Citation for the following functions:
// Date: 3/6/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

document.getElementById('confirm-button').addEventListener('click', function() {
    // Gather the data from the form
    let patient_treatment_id = document.getElementById('patient_treatment_id').value;
    let patient_id = document.getElementById('patient_name').value;
    let treatment_id = document.getElementById('treatment_desc').value;

    console.log(patient_id)

    // Get the previous values from the row above
    let prev_pname = document.getElementById('prev_pname').getAttribute('data-prev-pid');
    let prev_tdesc = document.getElementById('prev_tdesc').getAttribute('data-prev-tid');

    // Use previous values if the input fields are empty
    if (patient_id == "none") {
        patient_id = prev_pname;
    }
    if (treatment_id == "none") {
        treatment_id = prev_tdesc;
    }

    if (treatment_id == "NULL") {
        alert('Treatment Description required. Please fill in this field before submitting.');
        return;
    }

    // Create a JavaScript object to hold the data
    let data = {
        patient_treatment_id: patient_treatment_id,
        patient_id: patient_id,
        treatment_id: treatment_id // Ensure treatment_id is an integer
    };

    // Send the data to the server using an AJAX PUT request
    fetch('/put-patient-treatment-ajax', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 204) {
            // If the update was successful, redirect to the patients_treaments page
            window.location.href = '/patients_treatments.hbs';
        } else {
            console.error('Error updating patient treatment');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('cancel-button').addEventListener('click', function() {
    // Redirect to the patients_treatments page if the user cancels
    window.location.href = '/patients_treatments.hbs';
});