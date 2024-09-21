const apiUrl = 'https://compute.samford.edu/zoh/api/national-parks';

async function fetchParks() {
    const response = await fetch(apiUrl,{headers:{"Accept":"application/json"}});
    const data = await response.json();
    return data.nationalParks;
}

function populateTable(parks) {
    const table = document.getElementById('parksTable');
    if (!table) {
        console.error('Table element with id "parksTable" not found.');
        return;
    }
    parks.forEach(park => {
        let row = table.insertRow();
        const IDCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const locationCell = row.insertCell(2);
        IDCell.textContent = park.id;
        nameCell.textContent = park.name;
        locationCell.textContent = park.location;
    });
}

fetchParks().then(parks => populateTable(parks)).catch(error => {
    console.error('Error fetching parks:', error);
});
async function addPark(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const form = document.getElementById('addParkForm');
    const addApiUrl = 'https://compute.samford.edu/zoh/api/national-parks/add';
    if (!form) {
        console.error('Form element with id "addParkForm" not found.');
        return;
    }

    const parkNameInput = document.getElementById('parkName');
    const parkLocationInput = document.getElementById('parkLocation');

    if (!parkNameInput || !parkLocationInput) {
        console.error('Input elements with ids "parkName" or "parkLocation" not found.');
        return;
    }

    const newPark = {
        name: parkNameInput.value,
        location: parkLocationInput.value
    };

    try {
        const response = await fetch(addApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newPark)
        });

        if (!response.ok) {
            throw new Error('Failed to add park');
        }

        const addedPark = await response.json();

        const table = document.getElementById('parksTable');
        if (!table) {
            console.error('Table element with id "parksTable" not found.');
            return;
        }

        let row = table.insertRow();
        const IDCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const locationCell = row.insertCell(2);
        IDCell.textContent = addedPark.id;
        nameCell.textContent = addedPark.name;
        locationCell.textContent = addedPark.location;

        // Optionally, you can clear the form inputs after adding the park
        form.reset();
    } catch (error) {
        console.error('Error adding park:', error);
    }
}
document.getElementById('addParkForm').addEventListener('submit', addPark);


async function modifyPark() {
    const form = document.getElementById('updateParkForm');
     const modifyApiUrl = 'https://compute.samford.edu/zoh/api/national-parks/edit/id';
    if (!form) {
        console.error('Form element with id "updateParkForm" not found.');
        return;
    }

    const parkIdInput = document.getElementById('updateParkId');
    const parkNameInput = document.getElementById('updateParkName');
    const parkLocationInput = document.getElementById('updateParkLocation');

    if (!parkIdInput || !parkNameInput || !parkLocationInput) {
        console.error('Input elements with ids "updateParkId", "updateParkName", or "updateParkLocation" not found.');
        return;
    }

    const updatedPark = {
        name: parkNameInput.value,
        location: parkLocationInput.value
    };

    const parkId = parkIdInput.value;

    try {
        const response = await fetch(`${modifyApiUrl}/${parkId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updatedPark)
        });

        if (!response.ok) {
            throw new Error('Failed to update park');
        }

        const table = document.getElementById('parksTable');
        if (!table) {
            console.error('Table element with id "parksTable" not found.');
            return;
        }

        const rows = table.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const idCell = row.cells[0];
            if (idCell.textContent === parkId) {
                row.cells[1].textContent = updatedPark.name;
                row.cells[2].textContent = updatedPark.location;
                break;
            }
        }

        // Optionally, you can clear the form inputs after updating the park
        form.reset();
    } catch (error) {
        console.error('Error updating park:', error);
    }
}

async function deletePark() {
    const form = document.getElementById('removeParkForm');
    const deleteApiUrl = 'https://compute.samford.edu/zoh/api/national-parks/delete'
    if (!form) {
        console.error('Form element with id "removeParkForm" not found.');
        return;
    }

    const parkIdInput = document.getElementById('deleteParkId');
    if (!parkIdInput) {
        console.error('Input element with id "deleteParkId" not found.');
        return;
    }

    const parkId = parkIdInput.value;

    try {
        const response = await fetch(`${deleteApiUrl}/${parkId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete park');
        }

        const table = document.getElementById('parksTable');
        if (!table) {
            console.error('Table element with id "parksTable" not found.');
            return;
        }

        const rows = table.rows;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const idCell = row.cells[0];
            if (idCell.textContent === parkId) {
                table.deleteRow(i);
                break;
            }
        }

        // Optionally, you can clear the form input after deleting the park
        form.reset();
    } catch (error) {
        console.error('Error deleting park:', error);
    }
}

