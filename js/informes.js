document.addEventListener('DOMContentLoaded', function() {
    // Obtener los datos de monedas guardadas desde localStorage
    const monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
    console.log(monedasGuardadas);

    // Inicializar arrays y objetos para etiquetas y datasets
    const etiquetas = [];
    const datasets = {};

    // Función para generar un color aleatorio en formato hexadecimal
    function getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

    // Iterar sobre las fechas en monedasGuardadas
    Object.keys(monedasGuardadas).forEach((fecha, index) => {
        // Obtener las cotizaciones para la fecha actual
        const cotizaciones = monedasGuardadas[fecha];

        // Agregar la fecha a etiquetas si no está presente
        if (!etiquetas.includes(fecha)) {
            etiquetas.push(fecha);
        }

        // Iterar sobre las cotizaciones de la fecha actual
        cotizaciones.forEach(cotizacion => {
            const { moneda, compra, venta } = cotizacion;

            // Crear dataset de compra si no existe para esa moneda
            if (!datasets[moneda]) {
                datasets[moneda] = {
                    label: `${moneda} - Compra`,
                    data: [], // Inicializar array para almacenar datos de compra
                    borderColor: getRandomColor(), // Asignar color aleatorio para el borde
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    fill: false
                };

                // Crear dataset de venta si no existe para esa moneda
                datasets[`${moneda} - Venta`] = {
                    label: `${moneda} - Venta`,
                    data: [], // Inicializar array para almacenar datos de venta
                    borderColor: getRandomColor(), // Asignar otro color aleatorio para el borde
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    fill: false
                };
            }

            // Agregar precio de compra al dataset correspondiente
            datasets[moneda].data.push(compra);

            // Agregar precio de venta al dataset correspondiente
            datasets[`${moneda} - Venta`].data.push(venta);
        });
    });

    // Obtener el contexto del gráfico desde el elemento con ID 'miGrafico'
    const ctx = document.getElementById('miGrafico').getContext('2d');

    // Crear un gráfico de tipo línea utilizando Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas, // Etiquetas para el eje X (fechas)
            datasets: Object.values(datasets) // Convertir el objeto datasets en un array de datasets para los datos del gráfico
        }
    });
});