require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

app.get("/api/places", async (req, res) => {
    try {
        const { lat, lng, type } = req.query;
        if (!lat || !lng || !type) {
            return res.status(400).json({ error: "Missing parameters (lat, lng, type)" });
        }

        const googlePlacesURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
        
        console.log("Fetching from Google API:", googlePlacesURL); // Debugging

        const response = await axios.get(googlePlacesURL);
        
        console.log("Google API Response:", response.data); // Debugging

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching places:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
