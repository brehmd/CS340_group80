// Get the objects we need to modify
let addDoctorButton = document.getElementById('confirm-button');
let cancelButton = document.getElementById('cancel-button');

// Modify the objects we need
addDoctorButton.addEventListener("click", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("first_name");
    let inputLastName = document.getElementById("last_name");
    let inputSpecialization = document.getElementById("specialization");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let specializationValue = inputSpecialization.value;

    if (!firstNameValue || !lastNameValue || !specializationValue) {
        // Display an error message
        alert('All fields are required. Please fill in all the fields before submitting.');
        return; // Stop the function execution if any field is empty
    }

    // Put our data we want to send in a javascript object
    let data = {
        first_name: firstNameValue,
        last_name: lastNameValue,
        specialization: specializationValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_doctors-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputSpecialization.value = '';


            // Add the new data to the table
            window.open("/doctors.hbs", "_self");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

cancelButton.addEventListener("click", function(e){
    e.preventDefault();
    window.open("/doctors.hbs", "_self")
})