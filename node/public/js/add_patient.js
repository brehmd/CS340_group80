// Get the objects we need to modify
let addPatientButton = document.getElementById('confirm-button');
let cancelButton = document.getElementById('cancel-button');

// Modify the objects we need
addPatientButton.addEventListener("click", function (e) {
    
    // Prevent the form from submitting
    // e.preventDefault();

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

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputAge.value = '';
            inputPhoneNumber.value = '';
            inputEsiLevel.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    window.open("/patients.hbs", "_self")
})

cancelButton.addEventListener("click", function(e){
    // e.preventDefault();
    window.open("/patients.hbs", "_self")
})