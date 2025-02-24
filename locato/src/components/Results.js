import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Spinner, Button, Alert } from "react-bootstrap";
import axios from "axios";

const OPENCAGE_API_KEY = "40ef5a460a504ec28bcf7659bb8ef01b"; // Replace with your OpenCage API key
const UNSPLASH_ACCESS_KEY = "N59uE-V9XY_U6JXwjYYRPQNWAr11V9MDlkNEMYLziTQ"; // Replace with your Unsplash API key

const CATEGORY_TAGS = {
  gym: '["leisure"="fitness_centre"]',
  restaurant: '["amenity"="restaurant"]',
  hospital: '["amenity"="hospital"]',
  school: '["amenity"="school"]',
  park: '["leisure"="park"]',
  hotel: '["tourism"="hotel"]',
  bank: '["amenity"="bank"]',
  movie_theater: '["amenity"="cinema"]', // ✅ Added Theater (Cinema)
};

const Results = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const locationName = queryParams.get("location");
  const category = queryParams.get("category");

  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!locationName || !category) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Convert Location Name to Coordinates
        const locationRes = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationName)}&key=${OPENCAGE_API_KEY}&limit=1`
        );

        if (!locationRes.data.results.length) {
          setError("Location not found.");
          setLoading(false);
          return;
        }

        const { lat, lng } = locationRes.data.results[0].geometry;

        // ✅ Check if the Category Exists in CATEGORY_TAGS
        if (!CATEGORY_TAGS[category.toLowerCase()]) {
          setError("Invalid category. Please try another one.");
          setLoading(false);
          return;
        }

        // Fetch Nearby Places from Overpass API
        const overpassQuery = `
          [out:json];
          (
            node${CATEGORY_TAGS[category.toLowerCase()]}(around:10000, ${lat}, ${lng});
            way${CATEGORY_TAGS[category.toLowerCase()]}(around:10000, ${lat}, ${lng});
            relation${CATEGORY_TAGS[category.toLowerCase()]}(around:10000, ${lat}, ${lng});
          );
          out center;
        `;

        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
        const placesRes = await axios.get(overpassUrl);

        if (!placesRes.data.elements || placesRes.data.elements.length === 0) {
          setError(`No ${category} found in ${locationName}.`);
          setLoading(false);
          return;
        }

        let placesData = placesRes.data.elements.map((place) => ({
          name: place.tags.name || `Unnamed ${category}`,
          vicinity: locationName, // Use the searched location name
          lat: place.lat || place.center?.lat,
          lng: place.lon || place.center?.lon,
        }));

        // Fetch Images from Unsplash
        const imageRes = await axios.get(
          `https://api.unsplash.com/search/photos?query=${category}&per_page=10`,
          {
            headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          }
        );

        const images = imageRes.data.results.map((img) => img.urls.small);

        // Assign images to places
        placesData = placesData.map((place, index) => ({
          ...place,
          image: images[index] || "https://via.placeholder.com/300", // Default image if not found
        }));

        setPlaces(placesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationName, category, navigate]);

  return (
    <Container className="mt-4">
      <h2 className="text-center">Results for {category} in {locationName}</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {places.map((place, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card>
              <Card.Img variant="top" src={place.image} alt={place.name} />
              <Card.Body>
                <Card.Title>{place.name}</Card.Title>
                <Card.Text>{place.vicinity}</Card.Text>
                <Button variant="primary" href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`} target="_blank">
                  View on Map
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Results;
