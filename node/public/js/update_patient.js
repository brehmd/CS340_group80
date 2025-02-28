document.getElementById('confirm-button').addEventListener('click', function() {
    // Gather the data from the form
    let patient_id = document.getElementById('patient_id').value;
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let age = document.getElementById('age').value;
    let phone_number = document.getElementById('phone_number').value;
    let esi_level = document.getElementById('esi_level').value;


    if (!first_name || !last_name || !age || !phone_number || !esi_level) {
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