const reportTable = document.querySelector("#reportTable tbody");

async function loadReports() {

    try {

        const response = await fetch("http://localhost:5000/api/reports");

        if (!response.ok) {
            throw new Error("Failed to fetch report data");
        }

        const data = await response.json();

        console.log("Report Data:", data);

        reportTable.innerHTML = "";

        if (data.length === 0) {

            reportTable.innerHTML = `
            <tr>
                <td colspan="5">No feedback data available</td>
            </tr>
            `;

            return;
        }


        data.forEach(item => {

            reportTable.innerHTML += `
            <tr>

                <td>${item.product_id}</td>

                <td>${item.total_feedback}</td>

                <td>${item.positive}</td>

                <td>${item.negative}</td>

                <td>${item.neutral}</td>

            </tr>
            `;

        });


    } catch (error) {

        console.error("Error loading reports:", error);

        reportTable.innerHTML = `
        <tr>
            <td colspan="5">
                Unable to load report data.
                Check backend server.
            </td>
        </tr>
        `;

    }

}


// Load report when page opens
loadReports();