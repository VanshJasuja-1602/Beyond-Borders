

mapboxgl.accessToken = mapToken;

const coordinates = (listing && listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2)
  ? listing.geometry.coordinates
  : [77.209, 28.6139]; // Default fallback [lng, lat]

const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset:25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);

