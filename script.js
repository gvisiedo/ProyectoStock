//let inventario = JSON.parse(localStorage.getItem('miStock')) || [];
let inventario = [
    //{ id: 1, nombre: "Tornillos 1/2", cantidad: 100, precio: 0.50 },
    //{ id: 2, nombre: "Tuercas", cantidad: 50, precio: 0.30 }
];
const URL_API='';





/* funcion anterior en localstorage, eliminar después de comprobar acceso a google sheet
function nuevoProducto() {
    const nombre = document.getElementById('nombre').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);

    if (nombre && cantidad >= 0) {
        inventario.push({ nombre, cantidad });
        actualizarInterfaz();
        guardarEnLocal();
        // Limpiar campos
        document.getElementById('nombre').value = '';
        document.getElementById('cantidad').value = '';
    }
}*/


// Guardar en Google Sheets
async function guardarEnNube() {
    await fetch(URL_API, {
        method: 'POST',
        body: JSON.stringify(inventario)
    });
}

async function nuevoProducto() {
    const nombre = document.getElementById('nombre').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    if (nombre && !isNaN(cantidad)) {
        inventario.push({ nombre, cantidad });
        actualizarInterfaz();
        await guardarEnNube(); // Envía a Google Sheets
    }
}

function agregarProducto(id, nombre, cantidad, precio) {
    const nuevoProducto = { id, nombre, cantidad, precio };
    inventario.push(nuevoProducto);
    console.log(`Producto "${nombre}" agregado con éxito.`);
}

function ajustarStock(id, cambio) {
    const producto = inventario.find(p => p.id === id);
    if (producto) {
        producto.cantidad += cambio;
        console.log(`Nuevo stock de ${producto.nombre}: ${producto.cantidad}`);
    } else {
        console.error("Producto no encontrado.");
    }
}

function actualizarInterfaz() {
    const tabla = document.getElementById('lista-stock');
    tabla.innerHTML = '';

    inventario.forEach((prod, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${prod.nombre}</td>
                <td><strong>${prod.cantidad}</strong></td>
                <td>
                    <button onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button onclick="cambiarCantidad(${index}, -1)">-</button>
                    <button onclick="eliminar(${index})" style="background:red">x</button>
                </td>
            </tr>
        `;
    });
}

function cambiarCantidad(index, valor) {
    inventario[index].cantidad += valor;
    if(inventario[index].cantidad < 0) inventario[index].cantidad = 0;
    actualizarInterfaz();
    guardarEnNube();
}

function eliminar(index) {
    inventario.splice(index, 1);
    actualizarInterfaz();
    guardarEnNube();
}

/*function guardarEnLocal() {
    localStorage.setItem('miStock', JSON.stringify(inventario));
}*/

// Cargar desde Google Sheets
async function cargarDesdeNube() {
    const respuesta = await fetch(URL_API);
    inventario = await respuesta.json();
    actualizarInterfaz();
}

// Cargar datos al abrir
actualizarInterfaz();




function filtrarProductos() {
    const texto = document.getElementById('buscador').value.toLowerCase();
    const filas = document.querySelectorAll('#lista-stock tr');

    filas.forEach(fila => {
        // Obtenemos el nombre del producto que está en la primera celda (td)
        const nombreProducto = fila.cells[0].textContent.toLowerCase();
        
        if (nombreProducto.includes(texto)) {
            fila.style.display = ""; // Muestra la fila
        } else {
            fila.style.display = "none"; // Oculta la fila
        }
    });
}