function deletePatient(patient_id) {
    // Put our data we want to send in a javascript object
    let data = {
        id: patient_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-patients-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(patient_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    location.reload();
}

function deleteRow(patient_id){
    let table = document.getElementById("display-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == patient_id) {
            table.deleteRow(i);
            break;
       }
    }
}