'use strict';

const formulario = document.querySelector('#formulario');
const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const selectAsunto = document.querySelector('#asunto');
const textMensaje = document.querySelector('#mensaje');
const charCount = document.querySelector('#chars');
const resultado = document.querySelector('#resultado');
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function validarCampo(input, esValido, errorId) {
  const errorMsg = document.getElementById(errorId);

  if (esValido) {
    input.classList.remove('error');
    errorMsg.classList.remove('visible');
  } else {
    input.classList.add('error');
    errorMsg.classList.add('visible');
  }

  return esValido;
}


function validarNombre() {
  return validarCampo(
    inputNombre,
    inputNombre.value.trim().length >= 3,
    'error-nombre'
  );
}

function validarEmail() {
  return validarCampo(
    inputEmail,
    EMAIL_REGEX.test(inputEmail.value.trim()),
    'error-email'
  );
}

function validarAsunto() {
  return validarCampo(
    selectAsunto,
    selectAsunto.value.trim() !== '',
    'error-asunto'
  );
}

function validarMensaje() {
  return validarCampo(
    textMensaje,
    textMensaje.value.trim().length >= 10,
    'error-mensaje'
  );
}


function actualizarContador(e) {
  const longitud = e.target.value.length;
  charCount.textContent = longitud;
  charCount.style.color = longitud > 270 ? '#e74c3c' : '#999';
}

textMensaje.addEventListener('input', actualizarContador);


inputNombre.addEventListener('blur', validarNombre);
inputEmail.addEventListener('blur', validarEmail);
selectAsunto.addEventListener('blur', validarAsunto);
textMensaje.addEventListener('blur', validarMensaje);


function limpiarError(input, errorId) {
  input.classList.remove('error');
  document.getElementById(errorId).classList.remove('visible');
}


inputNombre.addEventListener('input', () => limpiarError(inputNombre, 'error-nombre'));
inputEmail.addEventListener('input', () => limpiarError(inputEmail, 'error-email'));
selectAsunto.addEventListener('change', () => limpiarError(selectAsunto, 'error-asunto'));
textMensaje.addEventListener('input', () => limpiarError(textMensaje, 'error-mensaje'));


function mostrarResultado() {
  resultado.innerHTML = '';

  const titulo = document.createElement('strong');
  titulo.textContent = 'Datos recibidos:';

  const pNombre = document.createElement('p');
  pNombre.textContent = `Nombre: ${inputNombre.value.trim()}`;

  const pEmail = document.createElement('p');
  pEmail.textContent = `Email: ${inputEmail.value.trim()}`;

  const pAsunto = document.createElement('p');
  pAsunto.textContent = `Asunto: ${selectAsunto.options[selectAsunto.selectedIndex].text}`;

  const pMensaje = document.createElement('p');
  pMensaje.textContent = `Mensaje: ${textMensaje.value.trim()}`;

  resultado.appendChild(titulo);
  resultado.appendChild(pNombre);
  resultado.appendChild(pEmail);
  resultado.appendChild(pAsunto);
  resultado.appendChild(pMensaje);

  resultado.classList.add('visible');
}


function resetearFormulario() {
  formulario.reset();
  charCount.textContent = '0';
  charCount.style.color = '#999';

  [inputNombre, inputEmail, selectAsunto, textMensaje].forEach((campo) => {
    campo.classList.remove('error');
  });

  document.querySelectorAll('.error-msg').forEach((msg) => {
    msg.classList.remove('visible');
  });
}

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombreValido = validarNombre();
  const emailValido = validarEmail();
  const asuntoValido = validarAsunto();
  const mensajeValido = validarMensaje();

  if (nombreValido && emailValido && asuntoValido && mensajeValido) {
    mostrarResultado();
    resetearFormulario();
    return;
  }

  if (!nombreValido) {
    inputNombre.focus();
    return;
  }
  if (!emailValido) {
    inputEmail.focus();
    return;
  }
  if (!asuntoValido) {
    selectAsunto.focus();
    return;
  }
  textMensaje.focus();
});


document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    formulario.requestSubmit();
  }
});

const inputNuevaTarea = document.querySelector('#nueva-tarea');
const btnAgregar = document.querySelector('#btn-agregar');
const listaTareas = document.querySelector('#lista-tareas');
const contadorTareas = document.querySelector('#contador-tareas');

let tareas = [
  { id: 1, texto: 'Estudiar JavaScript', completada: false },
  { id: 2, texto: 'Hacer la práctica', completada: false },
  { id: 3, texto: 'Subir al repositorio', completada: true }
];


function crearBotonEliminar() {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = 'Eliminar';
  boton.className = 'btn-eliminar';
  boton.dataset.action = 'eliminar';
  return boton;
}

function crearTextoTarea(tarea) {
  const span = document.createElement('span');
  span.textContent = tarea.texto;
  span.className = 'tarea-texto';
  span.dataset.action = 'toggle';
  return span;
}

function crearItemTarea(tarea) {
  const li = document.createElement('li');
  li.className = `tarea-item${tarea.completada ? ' completada' : ''}`;
  li.dataset.id = tarea.id;

  const texto = crearTextoTarea(tarea);
  const botonEliminar = crearBotonEliminar();

  li.appendChild(texto);
  li.appendChild(botonEliminar);

  return li;
}


function actualizarContadorTareas() {
  const pendientes = tareas.filter((tarea) => !tarea.completada).length;
  contadorTareas.textContent = `${pendientes} pendiente(s)`;
}


function renderizarTareas() {
  listaTareas.innerHTML = '';

  if (tareas.length === 0) {
    const itemVacio = document.createElement('li');
    itemVacio.className = 'estado-vacio';
    itemVacio.textContent = 'No hay tareas registradas';
    listaTareas.appendChild(itemVacio);
    contadorTareas.textContent = '0 pendiente(s)';
    return;
  }

  tareas.forEach((tarea) => {
    const item = crearItemTarea(tarea);
    listaTareas.appendChild(item);
  });

  actualizarContadorTareas();
}

function agregarTarea() {
  const texto = inputNuevaTarea.value.trim();

  if (texto === '') {
    inputNuevaTarea.focus();
    return;
  }

  tareas.push({
    id: Date.now(),
    texto,
    completada: false
  });

  inputNuevaTarea.value = '';
  renderizarTareas();
  inputNuevaTarea.focus();
}


btnAgregar.addEventListener('click', agregarTarea);

inputNuevaTarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    agregarTarea();
  }
});


listaTareas.addEventListener('click', (e) => {
  const action = e.target.dataset.action;

  if (!action) {
    return;
  }

  const item = e.target.closest('li');
  if (!item || !item.dataset.id) {
    return;
  }

  const id = Number(item.dataset.id);

  if (action === 'eliminar') {
    tareas = tareas.filter((tarea) => tarea.id !== id);
    renderizarTareas();
    return;
  }

  if (action === 'toggle') {
    const tarea = tareas.find((itemTarea) => itemTarea.id === id);
    if (tarea) {
      tarea.completada = !tarea.completada;
      renderizarTareas();
    }
  }
});

renderizarTareas();