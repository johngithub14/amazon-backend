const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Request received!",
    });
});

app.post("/payment/create", async (req, res) => {
    try {
        const total = parseInt(req.query.total);

        if (isNaN(total) || total < 0) {
            return res.status(400).json({
                message: "Total must be a positive non-zero number.",
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: "usd",
        });

        res.status(200).json({
            client_secret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
});

app.listen(5000, (err) => {
    if (err) throw err;
    console.log("Server is up and running at, http://localhost:5000");
});
