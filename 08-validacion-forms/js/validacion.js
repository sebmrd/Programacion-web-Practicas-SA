'use strict';

// 3 Regex personalizadas requeridas
const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelefono = /^\d{10}$/;
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// --- Funciones Auxiliares ---

// Mostrar error en el DOM
function mostrarError(campo, mensaje) {
    campo.classList.remove('valido');
    campo.classList.add('invalido');
    const spanError = document.getElementById(`error-${campo.name}`);
    spanError.textContent = mensaje;
    spanError.classList.add('visible');
}

// Limpiar error en el DOM
function limpiarError(campo) {
    campo.classList.remove('invalido');
    campo.classList.add('valido');
    const spanError = document.getElementById(`error-${campo.name}`);
    spanError.textContent = '';
    spanError.classList.remove('visible');
}

// Calcular si es mayor de edad
function esMayorDeEdad(fechaString) {
    const fechaNacimiento = new Date(fechaString);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    // Si el mes actual es menor al mes de nacimiento, o si es el mismo mes pero el día actual es menor, restamos 1 año
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad >= 18;
}

// Indicador de fuerza de la contraseña
function verificarFuerzaPassword(password) {
    const indicador = document.getElementById('indicador-fuerza');
    if (password.length === 0) {
        indicador.textContent = '';
        return;
    }
    
    let fuerza = 0;
    if (/[a-z]/.test(password)) fuerza++;
    if (/[A-Z]/.test(password)) fuerza++;
    if (/\d/.test(password)) fuerza++;
    if (password.length >= 8) fuerza++;

    if (fuerza <= 2) {
        indicador.textContent = 'Fuerza: Débil';
        indicador.style.color = '#e74c3c';
    } else if (fuerza === 3) {
        indicador.textContent = 'Fuerza: Media';
        indicador.style.color = '#f39c12';
    } else {
        indicador.textContent = 'Fuerza: Fuerte';
        indicador.style.color = '#2ecc71';
    }
}

// --- Lógica de Validación Principal ---

function validarCampo(campo) {
    const valor = campo.value.trim();
    let esValido = true;

    // Validación general de campos vacíos (Requisito: Todo campo obligatorio debe mostrar error si está vacío)
    if (campo.required && valor === '') {
        // Excepción para el checkbox (terminos)
        if (campo.type !== 'checkbox') {
            mostrarError(campo, 'Este campo es obligatorio.');
            return false;
        }
    }

    // Validación específica por campo
    switch (campo.name) {
        case 'nombre':
            if (valor.length < 3) {
                mostrarError(campo, 'El nombre debe tener al menos 3 caracteres.');
                esValido = false;
            } else if (!regexNombre.test(valor)) {
                mostrarError(campo, 'El nombre solo puede contener letras y espacios.');
                esValido = false;
            } else {
                limpiarError(campo);
            }
            break;

        case 'email':
            if (!regexEmail.test(valor)) {
                mostrarError(campo, 'Ingresa un correo electrónico válido (ejemplo@correo.com).');
                esValido = false;
            } else {
                limpiarError(campo);
            }
            break;

        case 'telefono':
            if (!regexTelefono.test(valor)) {
                mostrarError(campo, 'El teléfono debe contener exactamente 10 números.');
                esValido = false;
            } else {
                limpiarError(campo);
            }
            break;

        case 'fecha_nac':
            if (!esMayorDeEdad(valor)) {
                mostrarError(campo, 'Debes ser mayor de 18 años para registrarte.');
                esValido = false;
            } else {
                limpiarError(campo);
            }
            break;

        case 'genero':
            // Si llega aquí y no está vacío (verificado arriba), es válido
            limpiarError(campo);
            break;

        case 'password':
            if (!regexPassword.test(valor)) {
                mostrarError(campo, 'Mínimo 8 caracteres, incluir mayúscula, minúscula y número.');
                esValido = false;
            } else {
                limpiarError(campo);
            }
            // Validar también el campo de confirmar si ya tiene algo escrito
            const confirmPass = document.getElementById('confirm_password');
            if (confirmPass.value !== '') {
                validarCampo(confirmPass); 
            }
            break;

        case 'confirm_password':
            const password = document.getElementById('password').value;
            if (valor !== password) {
                mostrarError(campo, 'Las contraseñas no coinciden.');
                esValido = false;
            } else {
                limpiarError(campo);
            }
            break;

        case 'terminos':
            if (!campo.checked) {
                mostrarError(campo, 'Debes aceptar los términos y condiciones.');
                esValido = false;
            } else {
                limpiarError(campo);
            }
            break;
    }

    return esValido;
}

function validarFormulario() {
    let formularioValido = true;
    const elementos = form.querySelectorAll('input, select');
    
    elementos.forEach(campo => {
        const campoEsValido = validarCampo(campo);
        if (!campoEsValido) {
            formularioValido = false;
        }
    });
    
    return formularioValido;
}

// Extra: Habilitar/Deshabilitar botón de envío
function actualizarEstadoBoton() {
    const elementos = form.querySelectorAll('input, select');
    let todosLlenos = true;
    let sinErrores = true;

    elementos.forEach(campo => {
        if (campo.type === 'checkbox' && !campo.checked) {
            todosLlenos = false;
        } else if (campo.type !== 'checkbox' && campo.value.trim() === '') {
            todosLlenos = false;
        }

        if (campo.classList.contains('invalido')) {
            sinErrores = false;
        }
    });

    btnSubmit.disabled = !(todosLlenos && sinErrores);
}