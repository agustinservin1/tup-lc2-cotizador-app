document.addEventListener('DOMContentLoaded', () => {
    consultar_cotizacion();
    setInterval(consultar_cotizacion, 5 * 60 * 1000);

    // Escuchar cambios en el combo box
    const selectMoneda = document.getElementById('moneda');
    selectMoneda.addEventListener('change', () => {
        actualizarCotizaciones(selectMoneda.value.toLowerCase());
    });
});

const api_url = "https://dolarapi.com/v1";
let cotizaciones = {}; // Diccionario para almacenar las cotizaciones

function consultar_cotizacion() {
    let divisas = ["oficial", "blue", "bolsa", "contadoconliqui", "tarjeta", "mayorista", "cripto", "eur", "brl", "clp", "uyu"];

    for (let i = 0; i < divisas.length; i++) {
        let url = "";
        if (!["eur", "brl", "clp", "uyu"].includes(divisas[i])) {
            url = api_url + "/dolares/" + divisas[i];
        } else {
            url = api_url + "/cotizaciones/" + divisas[i];
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de la API para ' + divisas[i]);
                }
                return response.json();
            })
            .then(data => {
                // Almacenar los datos en el diccionario
                cotizaciones[divisas[i]] = data;

                // Llamar a la función para actualizar las cotizaciones según la selección actual
                actualizarCotizaciones(document.getElementById('moneda').value.toLowerCase());
            })
            .catch(error => {
                console.error("ERROR:", error);
            });
    }
}

function actualizarCotizaciones(monedaSeleccionada) {
    let divisas = ["oficial", "blue", "bolsa", "contadoconliqui", "tarjeta", "mayorista", "cripto", "eur", "brl", "clp", "uyu"];

    for (let i = 0; i < divisas.length; i++) {
        // Verificar si mostrar esta divisa según la selección del combo box
        if (monedaSeleccionada === "todas" || monedaSeleccionada === divisas[i]) {
            const compra = cotizaciones[divisas[i]].compra;
            const venta = cotizaciones[divisas[i]].venta;

            let elementoCompra = document.querySelector(".compra-dolar-" + divisas[i]);
            let elementoVenta = document.querySelector(".venta-dolar-" + divisas[i]);
            
            if (elementoCompra && elementoVenta) { // Verificar que los elementos existan antes de actualizar
                elementoCompra.textContent = compra;
                elementoVenta.textContent = venta;
            }
        }
    }
}

function cambiarMoneda(monedaSeleccionada) {
    actualizarCotizaciones(monedaSeleccionada);
}
