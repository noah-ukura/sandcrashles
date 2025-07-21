let map;
function beachIcon() {
  return L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/427/427735.png",
    iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32]
  });
}

async function fetchNearbyBeaches(lat, lon, radius = 5000) {
  const overpassQuery = `
    [out:json][timeout:25];
    (node["natural"="beach"](around:${radius},${lat},${lon});
     way["natural"="beach"](around:${radius},${lat},${lon});
     relation[type=multipolygon]["natural"="beach"](around:${radius},${lat},${lon});
    );
    out center;
  `;
  const resp = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: overpassQuery });
  const data = await resp.json();
  return data.elements;
}

function startTracking() {
  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude, lon = pos.coords.longitude;
    map = L.map("map").setView([lat, lon], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: '© OpenStreetMap contributors' }).addTo(map);
    //L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();
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

    const beaches = await fetchNearbyBeaches(lat, lon);
    beaches.forEach(el => {
      const coords = el.type === "node" ? {lat: el.lat, lon: el.lon} : el.center;
      if (!coords) return;
      L.marker([coords.lat, coords.lon], { icon: beachIcon() })
        .addTo(map)
        .bindPopup(`<b>🏖 Beach</b><br>Lat: ${coords.lat.toFixed(4)}, Lon: ${coords.lon.toFixed(4)}`);
    });
  }, err => console.error("GPS error:", err), { enableHighAccuracy: true });
}

window.addEventListener("load", startTracking);