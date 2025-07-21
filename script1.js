let map, marker;

function startTracking() {
  const latSpan = document.getElementById("lat");
  const lonSpan = document.getElementById("lon");
  const status = document.getElementById("status");

  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported.";
    return;
  }

  // status.textContent = "Requesting location...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // latSpan.textContent = lat.toFixed(6);
      // lonSpan.textContent = lon.toFixed(6);
      // status.textContent = "Location updated.";

      map = L.map("map").setView([lat, lon], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Main user marker
      marker = L.marker([lat, lon]).addTo(map)
        .bindPopup('<div id="popup-content"><button id="popup-btn">Sandcastle Found!!</button></div>')
        .openPopup();

      // Listen for popup clicks
      map.on('popupopen', () => {
        const btn = document.getElementById("popup-btn");
        if (btn) {
          btn.addEventListener("click", () => {
            const response = alert("There's no sandcastle here, Noah just thinks you are amazing and wants you to be his girlfriend :)");
            //console.log("User input:", response);
          });
        }
      });

      // Add beach-like markers nearby
      addRandomBeachMarkers(lat, lon);

    },
    (error) => {
      // status.textContent = `Error: ${error.message}`;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}

// Add 10 fake beach markers near user
function addRandomBeachMarkers(userLat, userLon) {
  for (let i = 0; i < 10; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.05;  // ~5km range
    const offsetLon = (Math.random() - 0.5) * 0.05;

    const lat = userLat + offsetLat;
    const lon = userLon + offsetLon;

    const beachMarker = L.marker([lat, lon], { icon: beachIcon() }).addTo(map);
    beachMarker.bindPopup(`<b>🏖 Sandcastle Found!!</b><br>Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`);
  }
}

// Optional: Custom beach icon
function beachIcon() {
  return L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/427/427735.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

startTracking();