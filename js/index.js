document.addEventListener("DOMContentLoaded", () => {
  consultarCotizaciones();
  setInterval(consultarCotizaciones, 5 * 60 * 1000);

  // Escuchar cambios en el combo box
  const selectMoneda = document.getElementById("moneda");
  selectMoneda.addEventListener("change", () => {
    actualizarCotizacionEnDOM(selectMoneda.value.toLowerCase());
  });

  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const moneda = btn.closest(".columna").id;
      agregarFavorito(moneda);
      actualizarIconoFavorito(btn, moneda);
    });
  });

  // Inicializar iconos de favoritos
  document.querySelectorAll(".fav-btn").forEach((btn) => {
    const moneda = btn.closest(".columna").id;
    actualizarIconoFavorito(btn, moneda);
  });
});

const api_url = "https://dolarapi.com/v1";
let cotizaciones = {}

// Diccionario para almacenar las cotizaciones
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

  divisas.forEach(divisa => {
    let url = "";
    if (!["eur", "brl", "clp", "uyu"].includes(divisa)) {
      url = `${api_url}/dolares/${divisa}`;
    } else {
      url = `${api_url}/cotizaciones/${divisa}`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al obtener los datos de la API para ${divisa}`);
        }
        return response.json();
      })
      .then(data => {
        cotizaciones[divisa] = data;
        actualizarCotizacionEnDOM(divisa, data);
        localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));
      })
      .catch(error => {
        console.error("ERROR:", error);
      });
  });
}

function actualizarCotizacionEnDOM(moneda, data) {
  const compra = data.compra;
  const venta = data.venta;
  const fecha_actualizacion = data.fechaActualizacion;

  let elementoCompra = document.querySelector(`.compra-dolar-${moneda}`);
  let elementoVenta = document.querySelector(`.venta-dolar-${moneda}`);

  if (elementoCompra && elementoVenta) {
    elementoCompra.textContent = compra;
    elementoVenta.textContent = venta;
  }

  let elementoFecha = document.getElementById("fecha-actualizada");
  if (elementoFecha) {
    elementoFecha.textContent = `Datos actualizados al ${fecha_actualizacion}`;
  }
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

function agregarFavorito(moneda) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

  const index = favoritos.findIndex((fav) => {
    return fav.moneda === moneda;

});
  if (index !== -1) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push({
      moneda: moneda,
      compra: cotizaciones[moneda].compra,
      venta: cotizaciones[moneda].venta,
      fecha_actualizacion: cotizaciones[moneda].fechaActualizacion,
    });
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  console.log("Favoritos actualizados: ", favoritos);
}

function actualizarIconoFavorito(btn, moneda) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  const icon = btn.querySelector("i");
  if (favoritos.some((fav) => fav.moneda === moneda)) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  }
}
