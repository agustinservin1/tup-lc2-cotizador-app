document.addEventListener("DOMContentLoaded", () => {
  consultarCotizaciones();
  setInterval(consultarCotizaciones, 5 * 60 * 1000);

  // Escuchar cambios en el combo box
  const selectMoneda = document.getElementById("moneda");
  selectMoneda.addEventListener("change", () => {
    actualizarCotizacionEnDOM(selectMoneda.value.toLowerCase());
  });
  const botonGuardarMoneda = document.getElementById("guardar-moneda");
  botonGuardarMoneda.addEventListener("click", () => {
    let icon = document.getElementById("estrella-azul");
    if (icon.classList.contains("fa-regular") && icon.classList.contains("fa-star")) {
      icon.classList.remove("fa-regular");
      icon.classList.remove("fa-star");
      icon.classList.add("fa-solid");
      icon.classList.add("fa-star");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }
  });
});

const api_url = "https://dolarapi.com/v1";
let cotizaciones = {}; // Diccionario para almacenar las cotizaciones

function consultarCotizaciones() {
  let divisas = [
    "oficial",
    "blue",
    "bolsa",
    "contadoconliqui",
    "tarjeta",
    "mayorista",
    "cripto",
    "eur",
    "brl",
    "clp",
    "uyu",
  ];
  let cotizaciones = {};

  for (let i = 0; i < divisas.length; i++) {
    let url = "";
    if (!["eur", "brl", "clp", "uyu"].includes(divisas[i])) {
      url = `${api_url}/dolares/${divisas[i]}`;
    } else {
      url = `${api_url}/cotizaciones/${divisas[i]}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al obtener los datos de la API para ${divisas[i]}`
          );
        }
        return response.json();
      })
      .then((data) => {
        cotizaciones[divisas[i]] = data;
        actualizarCotizacionEnDOM(divisas[i], data);
        localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));
      })
      .catch((error) => {
        console.error("ERROR:", error);
      });
  }
  console.log("cotizaciones", cotizaciones);
}

function actualizarCotizacionEnDOM(moneda, data) {
  const compra = data.compra;
  const venta = data.venta;
  const fecha_actualizacion = data.fechaActualizacion;

  let elementoCompra = document.querySelector(`.compra-dolar-${moneda}`);
  let elementoVenta = document.querySelector(`.venta-dolar-${moneda}`);
  elementoCompra.textContent = compra;
  elementoVenta.textContent = venta;

  let elementoFecha = document.getElementById("fecha-actualizada");
  elementoFecha.textContent = `Datos actualizados al ${fecha_actualizacion}`;
}

function filtrarCotizaciones() {
  const seleccion = document.getElementById("moneda").value.toLowerCase();
  const columnas = document.querySelectorAll(".columna");

  for (let i = 0; i < columnas.length; i++) {
    const columna = columnas[i];
    const nombreMoneda = columna
      .querySelector("h3")
      .textContent.trim()
      .toLowerCase();
    const mostrar = seleccion === "todas" || nombreMoneda.includes(seleccion);

    if (mostrar) {
      columna.style.display = "flex";
    } else {
      columna.style.display = "none";
    }
  }
}
// const botonGuardarMoneda = document.getElementById("guardar-moneda");
// botonGuardarMoneda.addEventListener("click", () => {
//   //const moneda = selectMoneda.value.toLowerCase();
//   //guardarEnLocalStorage("monedaSeleccionada", moneda);

//   let icon = document.getElementById("estrella-azul")
//   if (icon.classList.contains("fa-regular fa-star")) {
//     icon.classList.remove("fa-regular fa-star")
//     icon.classList.add("fa-solid fa-star")
//   }
// });
