let inventario = JSON.parse(localStorage.getItem('miStock')) || [];

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
    guardarEnLocal();
}

function eliminar(index) {
    inventario.splice(index, 1);
    actualizarInterfaz();
    guardarEnLocal();
}

function guardarEnLocal() {
    localStorage.setItem('miStock', JSON.stringify(inventario));
}

// Cargar datos al abrir
actualizarInterfaz();
