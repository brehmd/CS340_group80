// Get the objects we need to modify
let addDoctorDepartmentButton = document.getElementById('confirm-button');
let cancelButton = document.getElementById('cancel-button');

// Modify the objects we need
addDoctorDepartmentButton.addEventListener("click", function (e) {
    e.preventDefault();

    let inputDoctorID = document.getElementById("doctor_name");
    let inputDepartmentID = document.getElementById("department_name");

    let doctorValue = inputDoctorID.value;
    let departmentValue = inputDepartmentID.value;

    if (doctorValue == "none" || departmentValue == "none") {
        alert('All fields required. Please fill in all fields before submitting.');
        return;
    }

    let data = {
        doctor_id: parseInt(doctorValue),
        department_id: parseInt(departmentValue) // Ensure department_id is an integer
    };

    console.log("Data being sent to the server:", data); // Debugging: Log the data

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add_doctors_departments-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            inputDoctorID.value = '';
            inputDepartmentID.value = '';
            window.open("/doctors_departments.hbs", "_self");
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        }
    };

    xhttp.send(JSON.stringify(data));
});

cancelButton.addEventListener("click", function(e){
    e.preventDefault();
    window.open("/doctors_departments.hbs", "_self")
});