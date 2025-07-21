let map, marker;

function startTracking() {
  const latSpan = document.getElementById("lat");
  const lonSpan = document.getElementById("lon");
  const status = document.getElementById("status");

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  status.textContent = "Tracking location...";

  navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      latSpan.textContent = lat.toFixed(6);
      lonSpan.textContent = lon.toFixed(6);

      if (!map) {
        map = L.map("map").setView([lat, lon], 16);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);
        marker = L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();
      } else {
        map.setView([lat, lon]);
        marker.setLatLng([lat, lon]);
      }

      status.textContent = "Location updated.";
    },
    (error) => {
      status.textContent = `Error: ${error.message}`;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );
}