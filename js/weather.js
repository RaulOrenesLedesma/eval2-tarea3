export const API_KEY = 'bdc3100697e38a4328bd88af0d9493ae';
let chartInstance = null;

export async function fetchWeather(lat, lon) {
    const container = document.getElementById('weather-data');
    container.innerHTML = 'Obteniendo datos...';

    try {
        const [currentResp, forecastResp] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`)
        ]);

        const currentData = await currentResp.json();
        const forecastData = await forecastResp.json();

        displayCurrent(currentData);
        displayForecast(forecastData);
    } catch (err) {
        container.innerHTML = 'Error al cargar el clima.';
    }
}

function displayCurrent(data) {
    const container = document.getElementById('weather-data');
    container.innerHTML = `
        <div style="flex: 1; min-width: 200px;">
            <h3>${data.name}</h3>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="icon">
            <p><strong>${data.weather[0].description.toUpperCase()}</strong></p>
        </div>
        <div style="flex: 2;">
            <p>Temp: ${data.main.temp} °C (Máx: ${data.main.temp_max} / Mín: ${data.main.temp_min})</p>
            <p>Humedad: ${data.main.humidity}% | Viento: ${data.wind.speed} m/s</p>
            <p>Presión: ${data.main.pressure} hPa</p>
        </div>
    `;
}

function displayForecast(data) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    
    // Usamos todas las entradas (hasta 5 días cada 3h) para el gráfico
    const labels = data.list.map(item => item.dt_txt.replace(' ', '\n'));
    const temps = data.list.map(item => item.main.temp);

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pronóstico 5 días (°C)',
                data: temps,
                borderColor: '#3e95cd',
                backgroundColor: 'rgba(62, 149, 205, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: { autoSkip: true, maxTicksLimit: 10 }
                }
            }
        }
    });
}