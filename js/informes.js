document.addEventListener('DOMContentLoaded', function() {
    const monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
    let objetoInforme = {};
    const etiquetas = [];
    const datasets = {}; 
    function getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

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

    const datasetsArray = [];
    for (let moneda in datasets) {
        if (datasets.hasOwnProperty(moneda)) {
            datasetsArray.push(datasets[moneda].compra);
            datasetsArray.push(datasets[moneda].venta);
        }
    }

    const ctx = document.getElementById('miGrafico').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: datasetsArray
        }
    });

    cargarDatosLocalStorage();
    cargarComboInformes();
    document.getElementById("moneda").addEventListener('change', cargasDatosInforme);

    function cargarComboInformes(){
        const seleccionCombo = document.getElementById("moneda");
        seleccionCombo.innerHTML = ''; 
        for (let fecha in monedasGuardadas){
            for(let i = 0; i < monedasGuardadas[fecha].length; i++){
                const nombreMoneda = monedasGuardadas[fecha][i].nombre;
                const valueMoneda = monedasGuardadas[fecha][i].moneda.toLowerCase();
                if (!seleccionCombo.querySelector(`option[value="${valueMoneda}"]`)) {
                    const elementOption = document.createElement('option');
                    elementOption.value = valueMoneda;
                    elementOption.classList.add("select-moneda");
                    elementOption.textContent = nombreMoneda;
                    seleccionCombo.appendChild(elementOption);
                }
            }
        }   
    }

    function cargarDatosLocalStorage() {
        for (let fecha in monedasGuardadas) {
            monedasGuardadas[fecha].forEach(cotizacion => {
                const { nombre, moneda, compra, venta } = cotizacion;
                const monedaKey = moneda.toLowerCase();

                if (!objetoInforme[monedaKey]) {
                    objetoInforme[monedaKey] = {};
                }

                if (!objetoInforme[monedaKey][fecha]) {
                    objetoInforme[monedaKey][fecha] = [];
                }
                
                objetoInforme[monedaKey][fecha].push({
                    nombre: nombre,
                    compra: compra,
                    venta: venta
                });
            });
        }
        console.log(objetoInforme);
    }

    function cargasDatosInforme() {
        const seleccion = document.getElementById("moneda").value.toLowerCase();
        const tituloMoneda = document.getElementById("nombre-moneda");
        const tablaInforme = document.getElementById("tabla-informes-body");
        tablaInforme.innerHTML = '';
        
        if (objetoInforme[seleccion]) {
            
            console.log(`Cargando datos para: ${seleccion}`);
            Object.keys(objetoInforme[seleccion]).forEach(fecha => {
                const cotizaciones = objetoInforme[seleccion][fecha];
                cotizaciones.forEach(cotizacion => {
                    tituloMoneda.textContent = cotizacion.nombre
                    const { compra, venta } = cotizacion;

                    const fila = document.createElement('tr');

                    const celdaFecha = document.createElement('td');
                    celdaFecha.textContent = fecha;
                    fila.appendChild(celdaFecha);

                    const celdaCompra = document.createElement('td');
                    celdaCompra.textContent = `$${compra}`;
                    fila.appendChild(celdaCompra);
                    
                    const celdaVenta = document.createElement('td');
                    celdaVenta.textContent = `$${venta}`;
                    fila.appendChild(celdaVenta);

                    const celdaFlecha = document.createElement('td');
                    const iconoFlecha = document.createElement('i');
                    iconoFlecha.classList.add('fa-solid', 'fa-arrow-trend-up');
                    iconoFlecha.style.color = '#63E6BE'; // Color verde
                    celdaFlecha.appendChild(iconoFlecha);
                    fila.appendChild(celdaFlecha);

                    tablaInforme.appendChild(fila);
                });
            });
        } else {
            console.log(`No hay información disponible para la moneda ${seleccion}.`);
        }
    }
});
