// Base de datos simulada en memoria del navegador (localStorage)
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios')) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// 1. MÓDULO DE REGISTRO
document.getElementById('formRegistro').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombreRegistro').value.trim();
    const correo = document.getElementById('correoRegistro').value.trim();
    const password = document.getElementById('passwordRegistro').value.trim();
    const mensaje = document.getElementById('mensajeRegistro');

    // Validación de campos vacíos obligatorios [00:01:28]
    if (!nombre || !correo || !password) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error: Todos los campos son obligatorios.';
        return;
    }

    // Validación básica de formato de correo electrónico [00:02:15]
    if (!correo.includes('@') || !correo.includes('.')) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error: El correo electrónico no es válido.';
        return;
    }

    let usuarios = obtenerUsuarios();

    // Verificar si ya existe el correo
    const existe = usuarios.find(u => u.correo === correo);
    if (existe) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error: Este correo ya se encuentra registrado.';
        return;
    }

    // Registrar nuevo usuario
    usuarios.push({ nombre, correo, password });
    guardarUsuarios(usuarios);

    mensaje.style.color = 'green';
    mensaje.textContent = `¡Usuario registrado correctamente! Nombre: ${nombre}, Correo: ${correo}`;
    
    // Limpiar formulario
    document.getElementById('formRegistro').reset();
});

// 2. MÓDULO DE BÚSQUEDA DE PACIENTE [00:02:44]
document.getElementById('btnBuscar').addEventListener('click', function() {
    const correoBuscado = document.getElementById('correoBuscar').value.trim();
    const contenedorResultado = document.getElementById('resultadoBusqueda');

    if (!correoBuscado) {
        contenedorResultado.innerHTML = '<span style="color:red;">Por favor ingrese un correo para buscar.</span>';
        return;
    }

    let usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find(u => u.correo === correoBuscado);

    if (usuarioEncontrado) {
        contenedorResultado.innerHTML = `
            <strong>¡Paciente Encontrado!</strong><br>
            - Nombre: ${usuarioEncontrado.nombre}<br>
            - Correo: ${usuarioEncontrado.correo}
        `;
        contenedorResultado.style.color = '#27ae60';
    } else {
        contenedorResultado.innerHTML = 'Paciente no encontrado en el sistema.';
        contenedorResultado.style.color = '#c0392b';
    }
});

// 3. MÓDULO DE EDICIÓN / ACTUALIZACIÓN [00:03:46]
let correoEditandoActual = '';

document.getElementById('btnCargarDatos').addEventListener('click', function() {
    const correoConsulta = document.getElementById('correoEditarConsulta').value.trim();
    const mensajeEditar = document.getElementById('mensajeEditar');
    const seccionFormEditar = document.getElementById('seccionFormEditar');

    let usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.correo === correoConsulta);

    if (usuario) {
        correoEditandoActual = usuario.correo;
        document.getElementById('nombreEditar').value = usuario.nombre;
        document.getElementById('passwordEditar').value = usuario.password;
        
        seccionFormEditar.classList.remove('hidden');
        mensajeEditar.textContent = '';
    } else {
        seccionFormEditar.classList.add('hidden');
        mensajeEditar.style.color = 'red';
        mensajeEditar.textContent = 'No se encontró un usuario con ese correo para editar.';
    }
});

document.getElementById('btnActualizar').addEventListener('click', function() {
    const nuevoNombre = document.getElementById('nombreEditar').value.trim();
    const nuevaPassword = document.getElementById('passwordEditar').value.trim();
    const mensajeEditar = document.getElementById('mensajeEditar');

    if (!nuevoNombre || !nuevaPassword) {
        mensajeEditar.style.color = 'red';
        mensajeEditar.textContent = 'Los campos de edición no pueden estar vacíos.';
        return;
    }

    let usuarios = obtenerUsuarios();
    let index = usuarios.findIndex(u => u.correo === correoEditandoActual);

    if (index !== -1) {
        usuarios[index].nombre = nuevoNombre;
        usuarios[index].password = nuevaPassword;
        guardarUsuarios(usuarios);

        mensajeEditar.style.color = 'green';
        mensajeEditar.textContent = 'Datos actualizados exitosamente.';
        document.getElementById('seccionFormEditar').classList.add('hidden');
        document.getElementById('correoEditarConsulta').value = '';
    }
});