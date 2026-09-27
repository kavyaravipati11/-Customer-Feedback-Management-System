// ==========================================
// PRODUCT MANAGEMENT
// ==========================================

const productForm =
    document.getElementById("productForm");

const productTableBody =
    document.getElementById("productTableBody");


// ==========================================
// LOAD PRODUCTS
// ==========================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/products"
            );


        const products =
            await response.json();


        if (!response.ok) {

            throw new Error(
                products.message ||
                "Unable to load products"
            );

        }


        productTableBody.innerHTML = "";


        if (products.length === 0) {

            productTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        style="text-align:center;">

                        No products found

                    </td>

                </tr>

            `;

            return;

        }


        products.forEach(product => {

            productTableBody.innerHTML += `

                <tr>

                    <td>
                        ${product.product_id}
                    </td>

                    <td>
                        ${product.name}
                    </td>

                    <td>
                        ${product.category}
                    </td>

                    <td>

                        <button
                            onclick="editProduct(
                                ${product.product_id}
                            )">

                            Edit

                        </button>


                        <button
                            onclick="deleteProduct(
                                ${product.product_id}
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
            "Error loading products:",
            error
        );


        productTableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;">

                    Unable to load products

                </td>

            </tr>

        `;

    }

}


// ==========================================
// ADD PRODUCT
// ==========================================

productForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const category =
            document
                .getElementById("category")
                .value
                .trim();


        if (!name || !category) {

            alert(
                "Please fill all fields."
            );

            return;

        }


        const product = {

            name: name,

            category: category

        };


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/products",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(product)

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message ||
                    "Failed to add product"
                );

                console.error(result);

                return;

            }


            alert(
                result.message ||
                "Product added successfully"
            );


            productForm.reset();


            loadProducts();

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
// EDIT PRODUCT
// ==========================================

async function editProduct(id) {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/products/${id}`
            );


        const product =
            await response.json();


        if (!response.ok) {

            alert(
                product.message ||
                "Product not found"
            );

            return;

        }


        const newName =
            prompt(
                "Enter Product Name:",
                product.name
            );


        if (newName === null) {

            return;

        }


        const newCategory =
            prompt(
                "Enter Category:",
                product.category
            );


        if (newCategory === null) {

            return;

        }


        const updatedProduct = {

            name:
                newName.trim(),

            category:
                newCategory.trim()

        };


        const updateResponse =
            await fetch(
                `http://localhost:5000/api/products/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            updatedProduct
                        )

                }
            );


        const result =
            await updateResponse.json();


        if (!updateResponse.ok) {

            alert(
                result.message ||
                "Failed to update product"
            );

            return;

        }


        alert(
            result.message ||
            "Product updated successfully"
        );


        loadProducts();

    }
    catch (error) {

        console.error(error);

        alert(
            "Failed to update product."
        );

    }

}


// ==========================================
// DELETE PRODUCT
// ==========================================

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/products/${id}`,
                {

                    method: "DELETE"

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Failed to delete product"
            );

            return;

        }


        alert(
            result.message ||
            "Product deleted successfully"
        );


        loadProducts();

    }
    catch (error) {

        console.error(error);

        alert(
            "Failed to delete product."
        );

    }

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadProducts();