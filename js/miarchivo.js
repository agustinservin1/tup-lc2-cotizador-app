let monedasGuardadas = JSON.parse(localStorage.getItem("monedasGuardadas")) || {};

document.addEventListener("DOMContentLoaded", () => {
    console.log(monedasGuardadas);
    mostrarFavoritos();
});

function mostrarFavoritos() {
    const tbody = document.getElementById('tabla-datos');
    tbody.innerHTML = ''; 

    for (let fecha in monedasGuardadas) {
        if (monedasGuardadas[fecha].length > 0) { 
            const [anio, mes, dia] = fecha.split('-');
            const fechaFormateada = `${dia}/${mes}/${anio}`;
    
            const fechaElemento = document.createElement('tr');
            fechaElemento.classList.add('fecha');
            const fechaTd = document.createElement('td');
            fechaTd.colSpan = 5;
            fechaTd.classList.add('fila-fecha');
            fechaTd.textContent = fechaFormateada;
            fechaElemento.appendChild(fechaTd);
            tbody.appendChild(fechaElemento);
    
            monedasGuardadas[fecha].forEach((moneda, i) => {
                const tr = document.createElement('tr');
                tr.classList.add('datos');
                tr.dataset.fecha = fecha; 
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
                        button.style.cursor = 'pointer'
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
}

function eliminarFavorito(event) {
    const tr = event.target.closest('tr');
    const fecha = tr.dataset.fecha;
    const index = tr.dataset.index;
    
    monedasGuardadas[fecha].splice(index, 1);

    if (monedasGuardadas[fecha].length === 0) {
        delete monedasGuardadas[fecha];
    }
    localStorage.setItem('monedasGuardadas', JSON.stringify(monedasGuardadas));
    mostrarFavoritos();
}

function imprimirTabla() {
    const contenidoTabla = document.querySelector('.contenido-tabla').innerHTML;
    const originalContenido = document.body.innerHTML;

    document.body.innerHTML = contenidoTabla;
    window.print();
    document.body.innerHTML = originalContenido;
}

