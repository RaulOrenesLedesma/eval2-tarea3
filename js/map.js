import { fetchWeather } from './weather.js';

document.addEventListener('DOMContentLoaded', () => {
    // Mapa inicial centrado en una vista general
    const map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let marker;
    const coordElem = document.getElementById('coords');

    // Función para actualizar marcador, coordenadas y clima
    const updatePOI = (lat, lng) => {
        if (marker) marker.setLatLng([lat, lng]);
        else marker = L.marker([lat, lng]).addTo(map);
        
        map.setView([lat, lng], 10);
        if (coordElem) {
            coordElem.textContent = `Latitud: ${lat.toFixed(5)}, Longitud: ${lng.toFixed(5)}`;
        }
        fetchWeather(lat, lng);
    };

    // Pedir permiso de ubicación al inicio
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            updatePOI(pos.coords.latitude, pos.coords.longitude);
        }, () => {
            console.log("Acceso a ubicación denegado.");
        });
    }

    // Cambiar POI al hacer clic
    map.on('click', e => {
        updatePOI(e.latlng.lat, e.latlng.lng);
    });
});