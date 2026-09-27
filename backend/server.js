const express = require("express");
const cors = require("cors");

require("./db");

const feedbackRoutes =
    require("./routes/feedbackRoutes");

const userRoutes =
    require("./routes/userRoutes");

const reportRoutes =
    require("./routes/reportRoutes");

const customerRoutes =
    require("./customerRoutes");

const productRoutes =
    require("./productRoutes");


const app = express();


app.use(cors());

app.use(express.json());


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/api",
    feedbackRoutes
);

app.use(
    "/api",
    userRoutes
);

app.use(
    "/api",
    reportRoutes
);

app.use(
    "/api/customers",
    customerRoutes
);

app.use(
    "/api/products",
    productRoutes
);


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

    res.send(
        "Customer Feedback Backend Running"
    );

});


// ==========================================
// START SERVER
// ==========================================

app.listen(5000, () => {

    console.log(
        "Server running on port 5000"
    );

});