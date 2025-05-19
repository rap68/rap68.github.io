<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      color-scheme: dark;
    }
    html, body, #map {
      height: 100%;
      margin: 0;
      background: #121212;
      color: #fff;
      font-family: sans-serif;
    }
    #controls {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e1e1e;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    #controls input {
      padding: 8px;
      border-radius: 5px;
      border: none;
      width: 200px;
    }
    #controls button {
      padding: 15px 20px;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      width: 200px;
      cursor: pointer;
    }
    #removeLast {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #8b0000;
      color: white;
      padding: 15px 20px;
      font-size: 1rem;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      z-index: 1000;
    }
    #export {
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      background: #8b0000;
      color: white;
      padding: 15px 20px;
      font-size: 1rem;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      z-index: 1000;
    }

  </style>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
  <div id="controls">
    <input type="text" id="username" placeholder="Nom utilisateur" />
    Enregistrer un nouveau point :
    <button onclick="logPoint('3x4')">📍 3x4</button>
    <button onclick="logPoint('sucette')">📍 Sucette</button>
    <button onclick="logPoint('animé')">📍 Animé</button>
  </div>
  <button id="export" onclick="exportGPX()">💾 Export GPX</button>
  <button id="removeLast" onclick="removeLastPoint()">🗑 Supprimer dernier point</button>
  <div id="map"></div>

  <script>
    let map = L.map('map').setView([0, 0], 2);
    let points = [];
    let markers = [];

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

      if (!confirm("Voulez-vous ajouter un point de type " + type + " ?")) return;

      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const time = new Date().toISOString();

        points.push({ type, username, lat, lon, time });

        let marker = L.marker([lat, lon])
          .addTo(map)
          .bindPopup(type + "<br>" + username + "<br>" + time)
          .openPopup();

        markers.push(marker);

      }, err => {
        alert("Erreur de géolocalisation.");
        console.error("Géolocalisation échouée", err);
      });
    }

    function removeLastPoint() {
      if (points.length === 0) {
        alert("Aucun point à supprimer.");
        return;
      }
      if (!confirm("Supprimer le dernier point ajouté ?")) return;

      points.pop();
      let marker = markers.pop();
      if (marker) {
        map.removeLayer(marker);
      }
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
