document.addEventListener('DOMContentLoaded', function() {
    const monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
    console.log(monedasGuardadas);

    const etiquetas = [];
    const datasets = {};

    function getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

    // Recorrer las fechas y cotizaciones almacenadas
    const fechas = Object.keys(monedasGuardadas);
    for (let i = 0; i < fechas.length; i++) {
        const fecha = fechas[i];
        etiquetas.push(fecha);

        const cotizaciones = monedasGuardadas[fecha];
        for (let j = 0; j < cotizaciones.length; j++) {
            const cotizacion = cotizaciones[j];
            const { moneda, compra, venta } = cotizacion;

            if (!datasets[moneda]) {
                datasets[moneda] = {
                    compra: {
                        label: `${moneda} - Compra`,
                        data: [],
                        borderColor: getRandomColor(),
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        fill: false
                    },
                    venta: {
                        label: `${moneda} - Venta`,
                        data: [],
                        borderColor: getRandomColor(),
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        fill: false
                    }
                };
            }

            datasets[moneda].compra.data.push(compra);
            datasets[moneda].venta.data.push(venta);
        }
    }

    // Crear un arreglo de datasets para Chart.js
    const datasetsArray = [];
    for (let moneda in datasets) {
        if (datasets.hasOwnProperty(moneda)) {
            datasetsArray.push(datasets[moneda].compra);
            datasetsArray.push(datasets[moneda].venta);
        }
    }

    // Configurar y crear el grÃ¡fico
    const ctx = document.getElementById('miGrafico').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: datasetsArray
        }
    });
});