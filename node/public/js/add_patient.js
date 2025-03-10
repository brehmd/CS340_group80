// Citation for the following functions:
// Date: 3/2/25
// Adapted from 
// The code structure and logic were inspired by the Node.js Starter App repository, but the implementation was tailored to fit the specific requirements of a Hospital Management Database. No code was directly copied; instead, the patterns and best practices were followed.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Get the objects we need to modify
let addPatientButton = document.getElementById('confirm-button');
let cancelButton = document.getElementById('cancel-button');

// Modify the objects we need
addPatientButton.addEventListener("click", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("first_name");
    let inputLastName = document.getElementById("last_name");
    let inputAge = document.getElementById("age");
    let inputPhoneNumber = document.getElementById("phone_number");
    let inputEsiLevel = document.getElementById("esi_level");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let ageValue = inputAge.value;
    let phoneNumberValue = inputPhoneNumber.value;
    let esiLevelValue = inputEsiLevel.value;

    const phone_pattern = /^\d{3}-\d{4}$/;

    if (!phone_pattern.test(phoneNumberValue)) {
        alert('Please enter a valid phone number in the format 000-0000.');
        return; // Stop further execution if the phone number is invalid
    }

    if (!firstNameValue || !lastNameValue || !ageValue || !phoneNumberValue || !esiLevelValue) {
        // Display an error message
        alert('All fields are required. Please fill in all the fields before submitting.');
        return; // Stop the function execution if any field is empty
    }

    // Put our data we want to send in a javascript object
    let data = {
        first_name: firstNameValue,
        last_name: lastNameValue,
        age: ageValue,
        phone_number: phoneNumberValue,
        esi_level: esiLevelValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_patients-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputAge.value = '';
            inputPhoneNumber.value = '';
            inputEsiLevel.value = '';


            // Add the new data to the table
            window.open("/patients.hbs", "_self");
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
    window.open("/patients.hbs", "_self")
})