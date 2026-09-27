// ==========================================
// CUSTOMER MANAGEMENT
// ==========================================

const customerForm =
    document.getElementById("customerForm");

const customerTableBody =
    document.getElementById("customerTableBody");


// ==========================================
// LOAD CUSTOMERS
// ==========================================

async function loadCustomers() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/customers"
            );


        const customers =
            await response.json();


        if (!response.ok) {

            throw new Error(
                customers.message ||
                "Unable to load customers"
            );

        }


        customerTableBody.innerHTML = "";


        if (customers.length === 0) {

            customerTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="text-align:center;">

                        No customers found

                    </td>

                </tr>

            `;

            return;

        }


        customers.forEach(customer => {

            customerTableBody.innerHTML += `

                <tr>

                    <td>
                        ${customer.customer_id}
                    </td>

                    <td>
                        ${customer.name}
                    </td>

                    <td>
                        ${customer.email}
                    </td>

                    <td>
                        ${customer.country}
                    </td>

                    <td>

                        <button
                            onclick="editCustomer(
                                ${customer.customer_id}
                            )">

                            Edit

                        </button>


                        <button
                            onclick="deleteCustomer(
                                ${customer.customer_id}
                            )">

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        });

    }
    catch (error) {

        console.error(
            "Error loading customers:",
            error
        );


        customerTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="text-align:center;">

                    Unable to load customers

                </td>

            </tr>

        `;

    }

}


// ==========================================
// ADD CUSTOMER
// ==========================================

customerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const country =
            document
                .getElementById("country")
                .value
                .trim();


        if (!name || !email || !country) {

            alert(
                "Please fill all fields."
            );

            return;

        }


        const customer = {

            name: name,

            email: email,

            country: country

        };


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/customers",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(customer)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Failed to add customer"
                );

                console.error(result);

                return;

            }


            alert(
                result.message ||
                "Customer added successfully"
            );


            customerForm.reset();


            loadCustomers();

        }
        catch (error) {

            console.error(error);

            alert(
                "Unable to connect to backend server."
            );

        }

    }
);


// ==========================================
// EDIT CUSTOMER
// ==========================================

async function editCustomer(id) {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/customers/${id}`
            );


        const customer =
            await response.json();


        if (!response.ok) {

            alert(
                customer.message ||
                "Customer not found"
            );

            return;

        }


        const newName =
            prompt(
                "Enter Customer Name:",
                customer.name
            );


        if (newName === null) {

            return;

        }


        const newEmail =
            prompt(
                "Enter Email:",
                customer.email
            );


        if (newEmail === null) {

            return;

        }


        const newCountry =
            prompt(
                "Enter Country:",
                customer.country
            );


        if (newCountry === null) {

            return;

        }


        const updatedCustomer = {

            name:
                newName.trim(),

            email:
                newEmail.trim(),

            country:
                newCountry.trim()

        };


        const updateResponse =
            await fetch(
                `http://localhost:5000/api/customers/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            updatedCustomer
                        )

                }
            );


        const result =
            await updateResponse.json();


        if (!updateResponse.ok) {

            alert(
                result.message ||
                "Failed to update customer"
            );

            return;

        }


        alert(
            result.message ||
            "Customer updated successfully"
        );


        loadCustomers();

    }
    catch (error) {

        console.error(error);

        alert(
            "Failed to update customer."
        );

    }

}


// ==========================================
// DELETE CUSTOMER
// ==========================================

async function deleteCustomer(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/customers/${id}`,
                {

                    method: "DELETE"

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to delete customer"
            );

            return;

        }


        alert(
            result.message ||
            "Customer deleted successfully"
        );


        loadCustomers();

    }
    catch (error) {

        console.error(error);

        alert(
            "Failed to delete customer."
        );

    }

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadCustomers();