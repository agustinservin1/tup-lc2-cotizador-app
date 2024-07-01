let favoritos=JSON.parse(localStorage.getItem("favoritos"));

document.addEventListener("DOMContentLoaded", () => {
    console.log(favoritos.length);
    console.log(favoritos)
    mostrarFavoritos()})

    function mostrarFavoritos() {
        const fechaElementos = document.querySelectorAll(".fila-fecha");
        if (favoritos.length > 0) {
            const fecha_actualizacion = new Date(favoritos[0].fecha_actualizacion);

            // FORMATO FECHA
            const dia = String(fecha_actualizacion.getDate()).padStart(2, '0');
            const mes = String(fecha_actualizacion.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
            const anio = fecha_actualizacion.getFullYear();
            const fechaFormateada = `${dia}/${mes}/${anio}`;

            fechaElementos.forEach(elemento => {
                elemento.textContent = fechaFormateada;
            });
        }

        for(let i =0; i<favoritos.length;i++){
            const tr = document.createElement('tr');
            const tbody = document.getElementById('tabla-datos');
            tr.classList.add('datos');
            tr.dataset.index=i;// Asignar el índice del favorito al atributo data-index
            const contenido = ["",favoritos[i].moneda, favoritos[i].compra, favoritos[i].venta, ""]
            console.log(contenido)
                for(let z=0; z<contenido.length; z++){
                    const td = document.createElement("td")
                    if (z===1){
                        td.classList.add("moneda")
                    }
                    if (z === contenido.length-1) {
                        const button= document.createElement('button');
                        button.classList.add('button-delete');
                        button.innerHTML='<i class="fa-solid fa-trash"></i>';
                        button.addEventListener('click', eliminarFavorito);
                        td.appendChild(button)
                    } else {
                        td.textContent = contenido[z];
                    }  
                    tr.appendChild(td)
                }             
            tbody.appendChild(tr);
        }
        
    }
    // Agregar el evento click a los botones 

    function eliminarFavorito(event){
        const tr= event.target.closest('tr'); //Obtenemos la fila más cercana al botón que dispara el evento
        const index= tr.dataset.index;
        favoritos.splice(index,1);//Eliminamos el favorito del array usando el indice
        localStorage.setItem('favoritos', JSON.stringify(favoritos));//Actualización localstorage
        tr.remove();
        document.getElementById('tabla-datos').innerHTML="";
        mostrarFavoritos();
    } 



/*<td><button class="button-delete"><i class="fa-solid fa-trash"></i></button></td>*/
/*<tbody>
<tr>
<td colspan="5" class="fila-fecha">15/04/23</td>
</tr>
<tr class="datos">
<td></td>
<td class="moneda">Dólar Blue</td>
<td class="compra">$995</td>
<td class="venta">$1015</td>
<td><button class="button-delete"><i class="fa-solid fa-trash"></i></button></td>
</tr>*/


