export const fetchPlaces = async (locationName, category) => {
    const OPENCAGE_API_KEY = "40ef5a460a504ec28bcf7659bb8ef01b"; // Replace with your OpenCage API Key
  
    try {
      // 1️⃣ Convert Location Name to Coordinates (Lat, Lng)
      const geoResponse = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationName)}&key=${OPENCAGE_API_KEY}&limit=1`
      );
      const geoData = await geoResponse.json();
  
      if (!geoData.results || geoData.results.length === 0) {
        console.error("Location not found.");
        return [];
      }
  
      const { lat, lng } = geoData.results[0].geometry;
  
      // 2️⃣ Fetch Places from OpenStreetMap (Nominatim API) using Exact Category
      const placesResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${category}&limit=10&lat=${lat}&lon=${lng}&radius=10000`
      );
      const placesData = await placesResponse.json();
  
      if (!placesData || placesData.length === 0) {
        console.error("No places found for this category.");
        return [];
      }
  
      // 3️⃣ Map Results to Required Format
      return placesData.map((place) => ({
        name: place.display_name,
        vicinity: place.address?.road || place.address?.city || "Unknown",
        geometry: { location: { lat: place.lat, lng: place.lon } },
      }));
    } catch (error) {
      console.error("Error fetching places:", error);
      return [];
    }
  };
  