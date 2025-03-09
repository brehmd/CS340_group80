// Get the objects we need to modify
let addAppointmentButton = document.getElementById('confirm-button');
let cancelButton = document.getElementById('cancel-button');

// Modify the objects we need
addAppointmentButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Get form inputs
    let inputPatientID = document.getElementById("patient_name");
    let inputDoctorID = document.getElementById("doctor_name");
    let inputDepartmentID = document.getElementById("department_name");
    let inputDate = document.getElementById("appointment_date");
    let inputTime = document.getElementById("appointment_time");
    let inputReason = document.getElementById("reason");

    // Get values from the form inputs
    let patientValue = inputPatientID.value;
    let doctorValue = inputDoctorID.value;
    let departmentValue = inputDepartmentID.value;
    let dateValue = inputDate.value;
    let timeValue = inputTime.value;
    let reasonValue = inputReason.value;

    // Validate required fields
    if (departmentValue === "none" || !dateValue || !timeValue || !reasonValue) {
        alert('Department, Date, Time, and Reason are required fields. Please fill them in before submitting.');
        return;
    }

    // Convert patientValue and doctorValue to NULL if they are "none"
    if (patientValue === "none") {
        patientValue = null;
    } else {
        patientValue = parseInt(patientValue); // Ensure it's an integer
    }

    if (doctorValue === "none") {
        doctorValue = null;
    } else {
        doctorValue = parseInt(doctorValue); // Ensure it's an integer
    }

    // Prepare data to send to the server
    let data = {
        patient_id: patientValue,
        doctor_id: doctorValue,
        department_id: parseInt(departmentValue), // Ensure department_id is an integer
        appointment_date: dateValue,
        appointment_time: timeValue,
        reason: reasonValue
    };

    console.log("Data being sent to the server:", data); // Debugging: Log the data

    // Send the data to the server using an AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_appointments-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Clear the form inputs after successful submission
            inputPatientID.value = '';
            inputDoctorID.value = '';
            inputDepartmentID.value = '';
            inputDate.value = '';
            inputTime.value = '';
            inputReason.value = '';

            // Redirect to the appointments page
            window.open("/appointments.hbs", "_self");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    // Send the data as JSON
    xhttp.send(JSON.stringify(data));
});

// Handle the cancel button click
cancelButton.addEventListener("click", function(e){
    e.preventDefault();
    // Redirect to the appointments page without saving
    window.open("/appointments.hbs", "_self");
});