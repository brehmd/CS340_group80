document.getElementById('confirm-button').addEventListener('click', function() {
    // Gather the data from the form
    let doctor_id = document.getElementById('doctor_id').value;
    let first_name = document.getElementById('first_name').value;
    let last_name = document.getElementById('last_name').value;
    let specialization = document.getElementById('specialization').value;

    // Get the previous values from the row above
    let prev_first_name = document.getElementById('prev_fname').textContent;
    let prev_last_name = document.getElementById('prev_lname').textContent;
    let prev_special = document.getElementById('prev_special').textContent;

    // Use previous values if the input fields are empty
    if (!first_name) {
        first_name = prev_first_name;
    }
    if (!last_name) {
        last_name = prev_last_name;
    }
    if (!specialization) {
        specialization = prev_special;
    }

    if (first_name == "NULL" || last_name == "NULL" || specialization == "NULL") {
        // Display an error message
        alert('All fields are required. Please fill in all the fields before submitting.');
        return; // Stop the function execution if any field is empty
    }

    // Create a JavaScript object to hold the data
    let data = {
        doctor_id: doctor_id,
        first_name: first_name,
        last_name: last_name,
        specialization: specialization
    };

    // Send the data to the server using an AJAX PUT request
    fetch('/put-doctor-ajax', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 204) {
            // If the update was successful, redirect to the doctors page
            window.location.href = '/doctors.hbs';
        } else {
            console.error('Error updating doctor');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('cancel-button').addEventListener('click', function() {
    // Redirect to the doctors page if the user cancels
    window.location.href = '/doctors.hbs';
});