const monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
let objetoInforme = {}; // Objeto donde se almacenarán las cotizaciones agrupadas
document.addEventListener('DOMContentLoaded', function() {
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
    cargarComboInformes()
    cargarDatosLocalStorage()
    cargasDatosInforme()

});
function cargarComboInformes(){
    const seleccionCombo=document.getElementById("moneda");
    for (let fecha in monedasGuardadas){
        for(let i=0; i<monedasGuardadas[fecha].length; i++){
        const option=monedasGuardadas[fecha][i].nombre;
        const elementOption=document.createElement('option');
        elementOption.value=monedasGuardadas[fecha][i].moneda;
        elementOption.classList.add("select-moneda")//dar formato 
        elementOption.textContent=option;
        seleccionCombo.appendChild(elementOption);
        }
    }   
}
function cargarDatosLocalStorage() {

    for (let fecha in monedasGuardadas) {
        monedasGuardadas[fecha].forEach(cotizacion => {
            const { nombre, moneda, compra, venta } = cotizacion;

            if (!objetoInforme[nombre]) {
                objetoInforme[nombre] = {}; // Inicializar objeto para el nombre si no existe
            }

            if (!objetoInforme[nombre][fecha]) {
                objetoInforme[nombre][fecha] = []; // Inicializar array para la fecha si no existe
            }

            // Agregar la cotización al array correspondiente
            objetoInforme[nombre][fecha].push({
                moneda: moneda,
                compra: compra,
                venta: venta
            });
        });
    }
    console.log(objetoInforme); // Mostrar objetoInforme para verificar la estructura
}
/*
function cargasDatosInforme() {
    const seleccion = document.getElementById("moneda").value.toLowerCase();
    const tituloMoneda = document.getElementById("nombre-moneda");
    const tablaInforme = document.getElementById("tabla-informes-body");

    // Limpiar contenido anterior de la tabla de informes
    tablaInforme.innerHTML = '';

    if (objetoInforme[seleccion]) {
        // Iterar sobre las cotizaciones de la moneda seleccionada
        Object.keys(objetoInforme[seleccion]).forEach(fecha => {
            const { compra, venta } = objetoInforme[seleccion][fecha];

            // Crear fila <tr> con datos de fecha, compra, venta y flecha indicadora
            const fila = document.createElement('tr');

            // Fecha
            const celdaFecha = document.createElement('td');
            celdaFecha.textContent = fecha;
            fila.appendChild(celdaFecha);

            // Compra
            const celdaCompra = document.createElement('td');
            celdaCompra.textContent = `$${compra}`;
            fila.appendChild(celdaCompra);

            // Venta
            const celdaVenta = document.createElement('td');
            celdaVenta.textContent = `$${venta}`;
            fila.appendChild(celdaVenta);

            // Flecha indicadora (ejemplo con icono de flecha hacia arriba)
            const celdaFlecha = document.createElement('td');
            const iconoFlecha = document.createElement('i');
            iconoFlecha.classList.add('fa-solid', 'fa-arrow-trend-up');
            iconoFlecha.style.color = '#63E6BE'; // Color verde
            celdaFlecha.appendChild(iconoFlecha);
            fila.appendChild(celdaFlecha);

            // Agregar fila a la tabla de informes
            tablaInforme.appendChild(fila);
        });
    } else {
        // Mostrar mensaje o realizar acción si no hay información para la moneda seleccionada
        console.log(`No hay información disponible para la moneda ${seleccion}.`);
    }
}

/*  <tr>
    <td>15/04/2024</td>
    <td>$995</td>
    <td>$1050</td>
   <td><i class="fa-solid fa-arrow-trend-up" style="color: #63E6BE;"></i></td>
    </tr>*/