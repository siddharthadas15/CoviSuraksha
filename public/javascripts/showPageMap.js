let currentDate = new Date();
let time = currentDate.getHours();
let s='mapbox://styles/mapbox/dark-v10';
if(time>=6&&time<=17)
s='mapbox://styles/mapbox/light-v10';
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: s, // stylesheet location
    center: post.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});
map.addControl(new mapboxgl.NavigationControl());
console.log(post.geometry.coordinates)
new mapboxgl.Marker()
    .setLngLat(post.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${post.title}</h3><p>${post.location}</p>`
            )
    )
    .addTo(map)