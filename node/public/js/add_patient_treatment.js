// Get the objects we need to modify
let addPatientTreatmentButton = document.getElementById('confirm-button');
let cancelButton = document.getElementById('cancel-button');

// Modify the objects we need
addPatientTreatmentButton.addEventListener("click", function (e) {
    e.preventDefault();

    let inputPatientID = document.getElementById("patient_name");
    let inputTreatmentID = document.getElementById("treatment_desc");

    let patientValue = inputPatientID.value;
    let treatmentValue = inputTreatmentID.value;

    if (!treatmentValue) {
        alert('Treatment Description required. Please fill in this field before submitting.');
        return;
    }

    // Convert patientValue to NULL if it is "none"
    if (patientValue === "none") {
        patientValue = null;
    } else {
        patientValue = parseInt(patientValue); // Ensure it's an integer
    }

    let data = {
        patient_id: patientValue,
        treatment_id: parseInt(treatmentValue) // Ensure treatment_id is an integer
    };

    console.log("Data being sent to the server:", data); // Debugging: Log the data

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_patients_treatments-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            inputPatientID.value = '';
            inputTreatmentID.value = '';
            window.open("/patients_treatments.hbs", "_self");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

cancelButton.addEventListener("click", function(e){
    e.preventDefault();
    window.open("/patients_treatments.hbs", "_self")
});