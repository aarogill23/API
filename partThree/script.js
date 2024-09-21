const baseURL = "https://developer.nps.gov/api/v1";
const apiKey = [insert API Key];

function getNationalParks() {
  fetch(`${baseURL}/parks?limit=473&api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const tableBody = document.querySelector("#parksTableBody");
      if (!tableBody) {
        console.error("Element with ID 'parksTableBody' not found.");
        return;
      }
      data.data.forEach((park) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = park.fullName;
        row.appendChild(nameCell);

        const locationCell = document.createElement("td");
        const address = park.addresses ? park.addresses.find(addr => addr.type === "Physical") : null;
        locationCell.textContent = address ? `${address.city}, ${address.stateCode}` : "N/A";
        row.appendChild(locationCell);

        const urlCell = document.createElement("td");
        const link = document.createElement("a");
        link.href = park.url;
        link.textContent = "Website";
        urlCell.appendChild(link);
        row.appendChild(urlCell);

        tableBody.appendChild(row);
      });
    });
}

async function searchNationalPark(){
    const searchInput = document.querySelector("#searchInput").value.toLowerCase();
    const tableBody = document.querySelector("#parksTableBody");
    if (!tableBody) {
        console.error("Element with ID 'parksTableBody' not found.");
        return;
    }

    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(row => {
        const nameCell = row.querySelector("td:first-child");
        if (nameCell) {
            const parkName = nameCell.textContent.toLowerCase();
            if (parkName.includes(searchInput)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    });
}

async function clearSearch(){
    const searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        searchInput.value = "";
    }

    const rows = document.querySelectorAll("#parksTableBody tr");
    rows.forEach(row => {
        row.style.display = "";
    });
}

getNationalParks();
