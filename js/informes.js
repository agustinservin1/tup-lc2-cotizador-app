document.addEventListener('DOMContentLoaded', function() {
    const monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
    let objetoInforme = {};
    let chartInstance = null;

    function getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
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

    function cargarComboInformes() {
        const seleccionCombo = document.getElementById("moneda");
        seleccionCombo.innerHTML = ''; 

        // Agregar opción "TODAS"
        const todasOption = document.createElement('option');
        todasOption.value = 'todas';
        todasOption.classList.add("select-moneda");
        todasOption.textContent = 'Todas';
        seleccionCombo.appendChild(todasOption);

        for (let fecha in monedasGuardadas) {
            for (let i = 0; i < monedasGuardadas[fecha].length; i++) {
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

    function cargarGrafico(monedaSeleccionada) {
  const etiquetas = [];
  const datasets = [];

  const fechas = Object.keys(monedasGuardadas);
  for (let i = 0; i < fechas.length; i++) {
    const fecha = fechas[i];
    etiquetas.push(fecha);

    if (monedaSeleccionada === 'todas') {
      for (let j = 0; j < monedasGuardadas[fecha].length; j++) {
        const cotizacion = monedasGuardadas[fecha][j];
        const monedaKey = cotizacion.moneda.toLowerCase();

        let compraDataset = null;
        let ventaDataset = null;

        for (let k = 0; k < datasets.length; k++) {
          if (datasets[k].label === `${monedaKey.toUpperCase()} - Compra`) {
            compraDataset = datasets[k];
          }
          if (datasets[k].label === `${monedaKey.toUpperCase()} - Venta`) {
            ventaDataset = datasets[k];
          }
        }

        if (!compraDataset) {
          compraDataset = {
            label: `${monedaKey.toUpperCase()} - Compra`,
            data: [],
            borderColor: getRandomColor(),
            backgroundColor: 'transparent',
            borderWidth: 1,
            fill: false
          };
          datasets.push(compraDataset);
        }

        if (!ventaDataset) {
          ventaDataset = {
            label: `${monedaKey.toUpperCase()} - Venta`,
            data: [],
            borderColor: getRandomColor(),
            backgroundColor: 'transparent',
            borderWidth: 1,
            fill: false
          };
          datasets.push(ventaDataset);
        }

        compraDataset.data.push(cotizacion.compra);
        ventaDataset.data.push(cotizacion.venta);
      
                }
            } else {
                const cotizaciones = monedasGuardadas[fecha];
                for (let j = 0; j < cotizaciones.length; j++) {
                    const cotizacion = cotizaciones[j];
                    if (cotizacion.moneda.toLowerCase() === monedaSeleccionada) {
                        if (!datasets.some(ds => ds.label === `${monedaSeleccionada.toUpperCase()} - Compra`)) {
                            datasets.push({
                                label: `${monedaSeleccionada.toUpperCase()} - Compra`,
                                data: [],
                                borderColor: getRandomColor(),
                                backgroundColor: 'transparent',
                                borderWidth: 1,
                                fill: false
                            });
                            datasets.push({
                                label: `${monedaSeleccionada.toUpperCase()} - Venta`,
                                data: [],
                                borderColor: getRandomColor(),
                                backgroundColor: 'transparent',
                                borderWidth: 1,
                                fill: false
                            });
                        }

                        const compraDataset = datasets.find(ds => ds.label === `${monedaSeleccionada.toUpperCase()} - Compra`);
                        const ventaDataset = datasets.find(ds => ds.label === `${monedaSeleccionada.toUpperCase()} - Venta`);

                        compraDataset.data.push(cotizacion.compra);
                        ventaDataset.data.push(cotizacion.venta);
                    }
                }
            }
        }

        const ctx = document.getElementById('miGrafico').getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: etiquetas,
                datasets: datasets
            }
        });
    }

    cargarDatosLocalStorage();
    cargarComboInformes();

    document.getElementById("moneda").addEventListener('change', function() {
        const seleccion = document.getElementById("moneda").value.toLowerCase();
        cargasDatosInforme(seleccion);
        cargarGrafico(seleccion);
    });

    function cargasDatosInforme(monedaSeleccionada) {
        const seleccion = monedaSeleccionada.toLowerCase();
        const tituloMoneda = document.getElementById("nombre-moneda");
        const tablaInforme = document.getElementById("tabla-informes-body");
        tablaInforme.innerHTML = '';

        if (seleccion === 'todas') {
            tituloMoneda.textContent = 'Cotizaciones guardadas';
            for (let moneda in objetoInforme) {
                const nombreMoneda = objetoInforme[moneda][Object.keys(objetoInforme[moneda])[0]][0].nombre;
                const titulo = document.createElement('h3');
                titulo.textContent = nombreMoneda;
                tablaInforme.appendChild(titulo);

                const fechas = Object.keys(objetoInforme[moneda]);
                let ventaAnterior = null;

                fechas.forEach(fecha => {
                    const cotizaciones = objetoInforme[moneda][fecha];
                    cotizaciones.forEach(cotizacion => {
                        const { compra, venta } = cotizacion;

                        const fila = document.createElement('tr');
                        fila.classList.add('fila-cotizacion');
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

                        if (ventaAnterior === null) {
                            iconoFlecha.classList.add('fa-solid', 'fa-minus');
                            iconoFlecha.style.color = '#000000'; // Guion
                        } else {
                            if (venta > ventaAnterior) {
                                iconoFlecha.classList.add('fa-solid', 'fa-arrow-trend-up');
                                iconoFlecha.style.color = '#63E6BE'; // Color verde
                            } else if (venta < ventaAnterior) {
                                iconoFlecha.classList.add('fa-solid', 'fa-arrow-trend-down');
                                iconoFlecha.style.color = '#FF6B6B'; // Color rojo
                            } else {
                                iconoFlecha.classList.add('fa-solid', 'fa-minus');
                                iconoFlecha.style.color = '#000000'; // Guion
                            }
                        }

                        celdaFlecha.appendChild(iconoFlecha);
                        fila.appendChild(celdaFlecha);
                        tablaInforme.appendChild(fila);

                        ventaAnterior = venta;
                    });
                });
            }
        } else {
            if (objetoInforme[seleccion]) {
                console.log(`Cargando datos para: ${seleccion}`);
                const fechas = Object.keys(objetoInforme[seleccion]);
                let ventaAnterior = null;

                fechas.forEach(fecha => {
                    const cotizaciones = objetoInforme[seleccion][fecha];
                    cotizaciones.forEach(cotizacion => {
                        tituloMoneda.textContent = cotizacion.nombre;
                        const { compra, venta } = cotizacion;

                        const fila = document.createElement('tr');
                        fila.classList.add('fila-cotizacion');
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

                        if (ventaAnterior === null) {
                            iconoFlecha.classList.add('fa-solid', 'fa-minus');
                            iconoFlecha.style.color = '#000000'; // Guion
                        } else {
                            if (venta > ventaAnterior) {
                                iconoFlecha.classList.add('fa-solid', 'fa-arrow-trend-up');
                                iconoFlecha.style.color = '#63E6BE'; // Color verde
                            } else if (venta < ventaAnterior) {
                                iconoFlecha.classList.add('fa-solid', 'fa-arrow-trend-down');
                                iconoFlecha.style.color = '#FF6B6B'; // Color rojo
                            } else {
                                iconoFlecha.classList.add('fa-solid', 'fa-minus');
                                iconoFlecha.style.color = '#000000'; // Guion
                            }
                        }

                        celdaFlecha.appendChild(iconoFlecha);
                        fila.appendChild(celdaFlecha);
                        tablaInforme.appendChild(fila);

                        ventaAnterior = venta;
                    });
                });
            } else {
                console.log(`No hay información disponible para la moneda ${seleccion}.`);
            }
        }
    }



  
    const seleccionInicial = 'todas';
    document.getElementById("moneda").value = seleccionInicial;
    cargasDatosInforme(seleccionInicial);
    cargarGrafico(seleccionInicial);


    const btn = document.getElementById('button');

    document.getElementById('formulario-datos')
    .addEventListener('submit', function(event) {
    event.preventDefault();

    function formatJSONForEmail(jsonData) {
        let formattedText = '';
    
        for (let fecha in jsonData) {
            formattedText += `Fecha: ${fecha}\n`;
            jsonData[fecha].forEach(cotizacion => {
                formattedText += `Moneda: ${cotizacion.nombre}\n`;
                formattedText += `Compra: ${cotizacion.compra}\n`;
                formattedText += `Venta: ${cotizacion.venta}\n\n`;
            });
    
            formattedText += '\n';
        }
    
        return formattedText;
    }

    const textTabla = document.getElementById('message');
    textTabla.value = formatJSONForEmail(monedasGuardadas);

    btn.value = 'Sending...';

    const serviceID = 'default_service';
    const templateID = 'template_qzkn0sl';

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
        btn.value = 'Send Email';
        alert('Sent!');
        }, (err) => {
        btn.value = 'Send Email';
        alert(JSON.stringify(err));
        });
    });

    const formCompartirInfo = document.getElementById('formulario-datos');

    function openForm() {
        const buttonCompartirInfo = document.getElementById('btn-compartir')

        buttonCompartirInfo.addEventListener('click', () => {
            formCompartirInfo.style.display = 'flex'
        })
    }

    function closeForm() {
        const buttonCloseForm = document.getElementById('close-form');
        buttonCloseForm.addEventListener('click', () => {
            formCompartirInfo.style.display = 'none'
        } )
    }
    openForm();
    closeForm();

    function validarContenido(){
        const contenidoMain = document.querySelector('.main-informe')
        const div = document.getElementById('mensaje-error-moneda')
        if(Object.keys(monedasGuardadas).length === 0){
            const tituloInforme = document.getElementById('titulo-informes')
            tituloInforme.style.display = 'none'
            contenidoMain.style.display = 'none'
            const h2 = document.createElement('h2')
            h2.innerText = "No existen monedas Guardadas"
            div.appendChild(h2)
        }
        else{
            div.style.display = 'none'
        }
    }
    validarContenido()
});