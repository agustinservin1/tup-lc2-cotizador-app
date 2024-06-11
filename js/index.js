document.addEventListener('DOMContentLoaded', consultar_cotizacion);
const api_url="https://dolarapi.com/v1";
function consultar_cotizacion() {

    let divisas=["oficial", "blue", "bolsa", "contadoconliqui", "tarjeta", "mayorista","cripto","eur", "brl", "clp", "uyu"];
   
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

                const compra = data.compra;
                const venta = data.venta;
                // Asignamos los valores a los elementos correspondientes en el DOM
               let elementoCompra = document.getElementsByClassName("compra-dolar-" + divisas[i]);
               let elementoVenta =document.getElementsByClassName("venta-dolar-" + divisas[i]);
                elementoCompra[0].innerText=compra; 
                elementoVenta[0].innerText=venta;
            
            })

            .catch(error => {
                console.error("ERROR:", error);
            });
    }
}


