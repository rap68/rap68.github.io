# GPS Collector Web App

This is a lightweight web app for collecting GPS points with labels and exporting them as a `.gpx` file. It is optimized for quick field use, e.g. for mapping advertising panels or any physical markers.

## Features

- 📍 Add GPS points with a single tap
- 🏷️ Choose from predefined categories (e.g. `4x3`, `sucette`, `animé`)
- 📦 Export collected points to GPX format
- 🧮 Live counter of recorded points
- 📡 Uses browser geolocation API

## Usage

1. Open the app on a device with geolocation (smartphone recommended).
2. Allow location access when prompted.
3. Press one of the buttons to record a GPS point with the corresponding label.
4. If needed, remove the last point with the "Delete Last Point" button.
5. Use the "Export GPX" button to download all recorded points.
6. Send / import the gpx file into the mapping app of your choice

## Tech Stack

- HTML + CSS + Vanilla JavaScript
- Uses `navigator.geolocation.getCurrentPosition`
- Exports GPX manually (no server or database)

## Limitations

- Geolocation may take a few seconds to lock; wait for confirmation message.
- Accuracy depends on device and surroundings (usually ±5–15 meters).
- No map preview or real-time tracking (by design — minimal and offline-friendly)
