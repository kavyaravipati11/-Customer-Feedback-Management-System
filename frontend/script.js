let feedbackData = [];

const tableBody =
    document.querySelector("#feedbackTable tbody");


// =====================================================
// LOAD CUSTOMERS
// =====================================================

async function loadCustomers() {

    try {

        const response =
            await fetch("http://localhost:5000/api/customers");

        if (!response.ok) {

            throw new Error("Unable to load customers");

        }

        const customers =
            await response.json();

        const customerSelect =
            document.getElementById("customer_id");

        customerSelect.innerHTML =
            `<option value="">Select Customer</option>`;

        customers.forEach(customer => {

            customerSelect.innerHTML += `
                <option value="${customer.customer_id}">
                    ${customer.name} (ID: ${customer.customer_id})
                </option>
            `;

        });

    }
    catch (err) {

        console.error(
            "Error loading customers:",
            err
        );

    }

}


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

    try {

        const response =
            await fetch("http://localhost:5000/api/products");

        if (!response.ok) {

            throw new Error("Unable to load products");

        }

        const products =
            await response.json();

        const productSelect =
            document.getElementById("product_id");

        productSelect.innerHTML =
            `<option value="">Select Product</option>`;

        products.forEach(product => {

            productSelect.innerHTML += `
                <option value="${product.product_id}">
                    ${product.product_name} (ID: ${product.product_id})
                </option>
            `;

        });

    }
    catch (err) {

        console.error(
            "Error loading products:",
            err
        );

    }

}


// =====================================================
// LOAD FEEDBACK
// =====================================================

async function loadFeedback() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/feedback"
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load feedback"
            );

        }

        const data =
            await response.json();

        feedbackData = data;

        displayFeedback(data);

    }
    catch (err) {

        console.error(
            "Error loading feedback:",
            err
        );

    }

}


// =====================================================
// DISPLAY FEEDBACK
// =====================================================

function displayFeedback(data) {

    tableBody.innerHTML = "";

    let total = data.length;

    let positive = 0;

    let negative = 0;

    let neutral = 0;


    data.forEach(item => {

        if (item.sentiment === "Positive") {

            positive++;

        }
        else if (item.sentiment === "Negative") {

            negative++;

        }
        else {

            neutral++;

        }


        tableBody.innerHTML += `

            <tr>

                <td>
                    ${item.feedback_id}
                </td>

                <td>
                    ${item.customer_id}
                </td>

                <td>
                    ${item.product_id}
                </td>

                <td>
                    ${item.feedback_text}
                </td>

                <td>
                    ${item.sentiment}
                </td>

                <td>

                    <button
                        onclick="editFeedback(${item.feedback_id})">

                        Edit

                    </button>

                </td>

                <td>

                    <button
                        onclick="deleteFeedback(${item.feedback_id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });


    document.getElementById("total").innerText =
        total;

    document.getElementById("positive").innerText =
        positive;

    document.getElementById("negative").innerText =
        negative;

    document.getElementById("neutral").innerText =
        neutral;

}


// =====================================================
// ADD / UPDATE FEEDBACK
// =====================================================

document
    .getElementById("feedbackForm")
    .addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const customer_id =
                document
                    .getElementById("customer_id")
                    .value;


            const product_id =
                document
                    .getElementById("product_id")
                    .value;


            const feedback_text =
                document
                    .getElementById("feedback_text")
                    .value
                    .trim();


            const sentiment =
                document
                    .getElementById("sentiment")
                    .value;


            // -----------------------------
            // VALIDATION
            // -----------------------------

            if (!customer_id) {

                alert(
                    "Please select a customer."
                );

                return;

            }


            if (!product_id) {

                alert(
                    "Please select a product."
                );

                return;

            }


            if (!feedback_text) {

                alert(
                    "Please enter feedback."
                );

                return;

            }


            const feedback = {

                customer_id:
                    customer_id,

                product_id:
                    product_id,

                feedback_text:
                    feedback_text,

                sentiment:
                    sentiment

            };


            // -----------------------------
            // CHECK EDIT MODE
            // -----------------------------

            const editId =
                localStorage.getItem(
                    "editId"
                );


            const url = editId

                ? `http://localhost:5000/api/feedback/${editId}`

                : "http://localhost:5000/api/feedback";


            const method = editId
                ? "PUT"
                : "POST";


            try {

                const response =
                    await fetch(
                        url,
                        {

                            method:
                                method,

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    feedback
                                )

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    alert(
                        result.message ||
                        "Operation failed."
                    );

                    return;

                }


                alert(
                    result.message ||
                    "Feedback saved successfully."
                );


                // -----------------------------
                // RESET FORM
                // -----------------------------

                document
                    .getElementById(
                        "feedbackForm"
                    )
                    .reset();


                // Remove edit ID

                localStorage.removeItem(
                    "editId"
                );


                // Change button back

                document
                    .querySelector(
                        "#feedbackForm button"
                    )
                    .innerText =
                        "Submit Feedback";


                // Reload feedback

                loadFeedback();

            }
            catch (err) {

                console.error(err);

                alert(
                    "Unable to connect to backend server."
                );

            }

        }
    );


// =====================================================
// DELETE FEEDBACK
// =====================================================

async function deleteFeedback(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this feedback?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(

                `http://localhost:5000/api/feedback/${id}`,

                {

                    method:
                        "DELETE"

                }

            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to delete feedback."
            );

            return;

        }


        alert(
            result.message ||
            "Feedback deleted successfully."
        );


        loadFeedback();

    }
    catch (err) {

        console.error(err);

        alert(
            "Failed to connect to backend server."
        );

    }

}


// =====================================================
// SEARCH FEEDBACK
// =====================================================

function searchFeedback() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        feedbackData.filter(item => {

            return (

                String(
                    item.feedback_text
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    item.sentiment
                )
                .toLowerCase()
                .includes(search)

                ||

                String(
                    item.customer_id
                )
                .includes(search)

                ||

                String(
                    item.product_id
                )
                .includes(search)

            );

        });


    displayFeedback(filtered);

}


// =====================================================
// SEARCH EVENT
// =====================================================

document
    .getElementById("searchInput")
    .addEventListener(
        "keyup",
        searchFeedback
    );


// =====================================================
// EDIT FEEDBACK
// =====================================================

function editFeedback(id) {

    const item =
        feedbackData.find(
            data =>
                data.feedback_id == id
        );


    if (!item) {

        alert(
            "Feedback not found."
        );

        return;

    }


    // Select customer

    document
        .getElementById("customer_id")
        .value =
            item.customer_id;


    // Select product

    document
        .getElementById("product_id")
        .value =
            item.product_id;


    // Feedback text

    document
        .getElementById("feedback_text")
        .value =
            item.feedback_text;


    // Sentiment

    document
        .getElementById("sentiment")
        .value =
            item.sentiment;


    // Store edit ID

    localStorage.setItem(
        "editId",
        id
    );


    // Change button

    document
        .querySelector(
            "#feedbackForm button"
        )
        .innerText =
            "Update Feedback";


    // Scroll to form

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.href =
        "login.html";

}


// =====================================================
// INITIAL LOAD
// =====================================================

loadCustomers();

loadProducts();

loadFeedback();