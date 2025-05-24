let points = [];
const statusEl = document.getElementById("status");
document.body.appendChild(statusEl);
let username = localStorage.getItem("username") || prompt("Entrez votre nom :");

if (!localStorage.getItem("username")) {
    localStorage.setItem("username", username);
}

const saved = localStorage.getItem("gps_points");
if (saved) {
    try {
        points = JSON.parse(saved);
    } catch (e) {
        points = [];
    }

}

function setStatus(msg) {
  statusEl.textContent = msg;
}

function savePoints() {
  localStorage.setItem("gps_points", JSON.stringify(points));
  updateCounter();
}

function updateCounter() {
  const counts = { "4x3": 0, "sucette": 0, "animé": 0 };
  for (const p of points) counts[p.type]++;
  document.getElementById("counter").innerText =
  `4x3 : ${counts["4x3"]}\nSucette : ${counts["sucette"]}\nAnimé : ${counts["animé"]}`;
}

function addPoint(type) {
  setStatus("Localisation en cours...");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;

      const point = {
        lat: latitude,
        lon: longitude,
        time: new Date().toISOString(),
        type: type,
        accuracy: accuracy
      };

      points.push(point);
      compteur++;
      updateCounter();
      setStatus(`Point ajouté (±${Math.round(accuracy)}m)`);
      setTimeout(() => setStatus(""), 3000);
    },
    (err) => {
      console.error(err);
      setStatus("Erreur GPS");
      setTimeout(() => setStatus(""), 3000);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function removeLast() {
  if (points.length === 0) {
    alert("Aucun point à retirer.");
    return;
  }
  const last = points[points.length - 1];
  if (confirm(`Supprimer le dernier point de type "${last.type}" ?`)) {
    points.pop();
    savePoints();
  }
}

function exportData() {
  if (points.length === 0) {
    alert("Aucun point à exporter.");
    return;
  }

  const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.1" creator="Collecte GPS" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>Export ${username}</name></metadata>`;
  const gpxPoints = points.map(p =>
  `<wpt lat="${p.lat}" lon="${p.lon}">
  <name>${p.type} - ${p.user}</name>
  </wpt>`).join("\n");
  const gpxFooter = "</gpx>";
  const gpxData = `${gpxHeader}\n${gpxPoints}\n${gpxFooter}`;

  const blob = new Blob([gpxData], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `points_${username}_${new Date().toISOString().slice(0,19).replace(/:/g, "-")}.gpx`;
  a.click();
  URL.revokeObjectURL(url);
  points = [];
  savePoints();
}

updateCounter();