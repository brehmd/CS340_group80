document.getElementById('confirm-button').addEventListener('click', function() {
    // Gather the data from the form
    let doctor_department_id = document.getElementById('doctor_department_id').value;
    let doctor_id = document.getElementById('doctor_name').value;
    let department_id = document.getElementById('department_name').value;

    console.log(doctor_id)

    // Get the previous values from the row above
    let prev_doc = document.getElementById('prev_doc').getAttribute('data-prev-doc');
    let prev_dep = document.getElementById('prev_dep').getAttribute('data-prev-dep');

    // Use previous values if the input fields are empty
    if (doctor_id == "none") {
        doctor_id = prev_doc;
    }
    if (department_id == "none") {
        department_id = prev_dep;
    }

    if (doctor_id == "NULL" || department_id == "NULL") {
        alert('All fields required. Please fill in all fields before submitting.');
        return;
    }

    // Create a JavaScript object to hold the data
    let data = {
        doctor_department_id: doctor_department_id,
        doctor_id: doctor_id,
        department_id: department_id // Ensure department_id is an integer
    };

    // Send the data to the server using an AJAX PUT request
    fetch('/put-doctor-department-ajax', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 204) {
            // If the update was successful, redirect to the doctors_departments page
            window.location.href = '/doctors_departments.hbs';
        } else {
            console.error('Error updating doctor department');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('cancel-button').addEventListener('click', function() {
    // Redirect to the doctors_departments page if the user cancels
    window.location.href = '/doctors_departments.hbs';
});