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