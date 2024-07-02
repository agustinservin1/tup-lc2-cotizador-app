const apiUrl = 'https://dolarapi.com/v1';
let cotizacionesApi = {};

document.addEventListener('DOMContentLoaded', () => {
  consultarCotizaciones()

  const selectMoneda = document.getElementById("moneda");
  selectMoneda.addEventListener("change", () => {
    actualizarCotizacionEnDOM(selectMoneda.value.toLowerCase());
  });

  document.querySelectorAll(".fav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const moneda = btn.closest(".columna").id;
      const data = cotizacionesApi[moneda];
      guardarMonedas(moneda, data);
      actualizarBoton(btn, moneda);
    });
  });

  const monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
  console.log('monedas guardadas', monedasGuardadas)
  const fecha = obtenerFechaActual();
  if (monedasGuardadas[fecha]) {
    monedasGuardadas[fecha].forEach(({ moneda }) => {
      const btn = document.querySelector(`#${moneda} .fav-btn`);
      if (btn) {
        actualizarBoton(btn, moneda);
      }
    });
  }
});

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
      url = `${apiUrl}/dolares/${divisa}`;
    } else {
      url = `${apiUrl}/cotizaciones/${divisa}`;
    }

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al obtener los datos de la API para ${divisa}`);
        }
        return response.json();
      })
      .then(data => {
        cotizacionesApi[divisa] = data;
        actualizarCotizacionEnDOM(divisa, data);
        localStorage.setItem("cotizacionesApi", JSON.stringify(cotizacionesApi));
      })
      .catch(error => {
        console.error("ERROR:", error);
      });
  });
}

function mostrarMensajeError() {
  const contenedorMensaje = document.getElementById('mostrar-error');
  contenedorMensaje.classList.add('mostrar-error');
  const textoError = document.createElement('p');
  textoError.textContent = 'Error: Ha ocurrido un error al intentar consultar los datos.';
  contenedorMensaje.appendChild(textoError);
};

function actualizarCotizacionEnDOM(moneda, data) {
  const compra = data.compra;
  const venta = data.venta;
  const fechaActualizacion = data.fechaActualizacion;

  let elementoCompra = document.querySelector(`.compra-dolar-${moneda}`);
  let elementoVenta = document.querySelector(`.venta-dolar-${moneda}`);

  if (elementoCompra && elementoVenta) {
    elementoCompra.textContent = compra;
    elementoVenta.textContent = venta;
  }

  let elementoFecha = document.getElementById("fecha-actualizada");
  if (elementoFecha) {
    elementoFecha.textContent = `Datos actualizados al ${fechaActualizacion}`;
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
      .toLowerCase()

    const mostrar = seleccion === "todas" || nombreMoneda.includes(seleccion);

    if (mostrar) {
      columna.style.display = "flex";
      columna.style.width = '190%'; // se puede dejar o no
    } else {
      columna.style.display = "none";
    };
  };
};

function guardarMonedas(moneda, data) {
  let monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
  const fecha = obtenerFechaActual();

  if (!monedasGuardadas[fecha]) {
    monedasGuardadas[fecha] = [];
  }

  const index = monedasGuardadas[fecha].findIndex(cotizacion => cotizacion.moneda === moneda);

  if (index !== -1) {
    monedasGuardadas[fecha].splice(index, 1);
  } else {
    monedasGuardadas[fecha].push({
      moneda,
      compra: data.compra,
      venta: data.venta,
      fechaActualizacion: data.fechaActualizacion
    });
  };
  localStorage.setItem("monedasGuardadas", JSON.stringify(monedasGuardadas));
}

function actualizarBoton(btn, moneda) {
  let monedasGuardadas = JSON.parse(localStorage.getItem('monedasGuardadas')) || {};
  const icon = btn.querySelector('i');
  const fecha = obtenerFechaActual();

  if (monedasGuardadas[fecha] && monedasGuardadas[fecha].some((guardado) => guardado.moneda === moneda)) {
    icon.classList.remove("fa-regular");
    icon.classList.add("fa-solid");
  } else {
    icon.classList.remove("fa-solid");
    icon.classList.add("fa-regular");
  }
}

function obtenerFechaActual() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  return `${year}-${month}-${day}`;
}


///cuadro de comentarios
// Array de comentarios
const comentarios = [
  { nombre: "Roger Medina", opinion: "Tiene muy buen servicio y las cotizaciones son siempre correctas", foto:"img/profile-user.webp" },
  { nombre: "Ana López", opinion: "Me gusta mucho la atención al cliente, son muy rápidos en responder",foto:"img/user3.jpeg" },
  { nombre: "Carlos Pérez", opinion: "Excelente plataforma, fácil de usar y muy informativa",foto: "img/user2.webp" }
  
];

// Función para mostrar comentario aleatorio
function mostrarComentarioAleatorio() {
  const indice = Math.floor(Math.random() * comentarios.length);
  const comentario = comentarios[indice];

  const comentarioHTML = `
      <div class="comment-user">
          <img src="${comentario.foto}" alt="Foto de usuario">
          <div class="info-usuario">
              <p class="nombre">${comentario.nombre}</p>
              <p class="opinion">${comentario.opinion}</p>
          </div>
      </div>
  `;
 
  const commentContainer = document.getElementById("comment-container");
  commentContainer.innerHTML = comentarioHTML;
}

// Mostrar un comentario aleatorio al cargar la página
mostrarComentarioAleatorio();


setInterval(() => {
  mostrarComentarioAleatorio();
}, 4000); 