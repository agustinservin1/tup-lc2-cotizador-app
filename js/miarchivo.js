let monedasGuardadas = JSON.parse(localStorage.getItem("monedasGuardadas")) || {};

document.addEventListener("DOMContentLoaded", () => {
    console.log(monedasGuardadas);
    mostrarFavoritos();
});

function mostrarFavoritos() {
    const tbody = document.getElementById('tabla-datos');
    for (let fecha in monedasGuardadas) {
        const [anio, mes, dia] = fecha.split('-');
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        const fechaElemento = document.createElement('tr');
        fechaElemento.classList.add('fecha');
        const fechaTd = document.createElement('td');
        fechaTd.colSpan = 5;
        fechaTd.classList.add('fila-fecha')
        fechaTd.textContent = fechaFormateada;
        fechaElemento.appendChild(fechaTd);
        tbody.appendChild(fechaElemento);

        monedasGuardadas[fecha].forEach((moneda, i) => {
            const tr = document.createElement('tr');
            tr.classList.add('datos');
            tr.dataset.index = i;
            const datosMoneda = ['', moneda.moneda, moneda.compra, moneda.venta, ''];
            for (let z = 0; z < datosMoneda.length; z++) {
                const td = document.createElement('td');
                if (z === 1) {
                    td.classList.add('moneda');
                    td.textContent = datosMoneda[z];
                } else if (z === datosMoneda.length - 1) {
                    const button = document.createElement('button');
                    button.classList.add('button-delete');
                    button.innerHTML = '<i class="fa-solid fa-trash"></i>';
                    button.addEventListener('click', eliminarFavorito);
                    td.appendChild(button);
                } else {
                    td.textContent = datosMoneda[z];
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        });
    }
}

function eliminarFavorito(event) {
    const tr = event.target.closest('tr'); //Obtenemos la fila más cercana al botón que dispara el evento
    const index = tr.dataset.index;
    favoritos.splice(index, 1);//Eliminamos el favorito del array usando el indice
    localStorage.setItem('favoritos', JSON.stringify(favoritos));//Actualización localstorage
    tr.remove();
    document.getElementById('tabla-datos').innerHTML = "";
    mostrarFavoritos();
}

// falta hacer que si se eliminar todas las monedas de un dia tambien se borre el dia----- tambien falta agregarle la funcion al boton de elimiar