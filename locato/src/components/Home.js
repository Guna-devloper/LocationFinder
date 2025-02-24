import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";

const Home = () => {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("restaurant");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!location.trim()) {
      alert("Please enter a location!");
      return;
    }
    navigate(`/results?location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`);
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🔍 Search Nearby Places</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>📍 Location</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a city (e.g., New York)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>🏢 Category</Form.Label>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="restaurant">Restaurant 🍽️</option>
            <option value="hotel">Hotel 🏨</option>
            <option value="gym">Gym 🏋️</option>
            <option value="movie_theater">Theater 🎥</option> {/* ✅ Correct category */}
          </Form.Select>
        </Form.Group>

        <Button variant="dark" className="w-100" onClick={handleSearch}>
          🔎 Search
        </Button>
      </Form>
    </Container>
  );
};

export default Home;
