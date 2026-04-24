'use strict';

// app.js (Solo eventos)
const form = document.getElementById('registroForm');
const btnSubmit = document.getElementById('btnSubmit');

form.addEventListener('focusout', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        validarCampo(e.target);
        actualizarEstadoBoton(); 
    }
});

form.addEventListener('input', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        e.target.classList.remove('invalido');
        const spanError = document.getElementById(`error-${e.target.name}`);
        if (spanError) spanError.classList.remove('visible');

        if (e.target.name === 'password') verificarFuerzaPassword(e.target.value);
        actualizarEstadoBoton();
    }
});

form.addEventListener('change', function(e) {
    if (e.target.type === 'checkbox') {
        validarCampo(e.target);
        actualizarEstadoBoton();
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const divMensaje = document.getElementById('mensajeGlobal');
    divMensaje.style.display = 'block';

    if (validarFormulario()) {
        const formData = new FormData(form);
        const datos = Object.fromEntries(formData);
        datos.terminos = form.querySelector('[name="terminos"]').checked;

        console.log("Datos enviados:", datos);

        divMensaje.textContent = '¡Registro completado con éxito!';
        divMensaje.className = 'exito';

        form.reset();
        const elementos = form.querySelectorAll('input, select');
        elementos.forEach(el => el.classList.remove('valido', 'invalido'));
        document.getElementById('indicador-fuerza').textContent = '';
        btnSubmit.disabled = true;
    } else {
        divMensaje.textContent = 'Por favor, corrige los campos marcados en rojo.';
        divMensaje.className = 'error-global';
    }
});