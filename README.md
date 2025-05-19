
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>GPS Logger Minimal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html, body, #map { height: 100%; margin: 0; }
    #controls {
      position: absolute;
      top: 10px;
      left: 10px;
      background: white;
      padding: 10px;
      z-index: 1000;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      border-radius: 8px;
      font-family: sans-serif;
    }
    #controls button { display: block; margin: 5px 0; width: 100%; height: 20%; }
  </style>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div id="controls">
    <label for="username">Nom utilisateur :</label>
    <input type="text" id="username" placeholder="ex: alice" />
    <button onclick="logPoint('3x4')">📍 3x4</button>
    <button onclick="logPoint('sucette')">📍 Sucette</button>
    <button onclick="logPoint('animé')">📍 Animé</button>
    <button onclick="exportGPX()">💾 Export GPX</button>
  </div>
  <div id="map"></div>

  <script>
    let map = L.map('map').setView([0, 0], 2);
    let points = [];

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 18);
      });
    }

    function logPoint(type) {
      const username = document.getElementById('username').value.trim();
      if (!username) {
        alert("Merci de saisir un nom d'utilisateur.");
        return;
      }

      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const time = new Date().toISOString();

        points.push({ type, username, lat, lon, time });

        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(type + "<br>" + username + "<br>" + time)
          .openPopup();

        console.log("Point enregistré:", type, lat, lon);
      }, err => {
        alert("Erreur de géolocalisation.");
        console.error("Géolocalisation échouée", err);
      });
    }

    function exportGPX() {
      let gpxHeader = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<gpx version="1.1" creator="SimpleGPSLogger" xmlns="http://www.topografix.com/GPX/1/1">\n';
      let gpxFooter = '</gpx>';
      let gpxPoints = points.map(p => {
        return '  <wpt lat="' + p.lat + '" lon="' + p.lon + '">\n' +
               '    <name>' + p.type + '</name>\n' +
               '    <desc>' + p.username + '</desc>\n' +
               '    <time>' + p.time + '</time>\n' +
               '  </wpt>';
      }).join("\n");

      const blob = new Blob([gpxHeader + gpxPoints + "\n" + gpxFooter], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = "points.gpx";
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>
