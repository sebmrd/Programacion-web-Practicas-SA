'use strict';

const log = document.getElementById('log');
const resultados = document.getElementById('resultados');
let tiempoSecuencial = 0;
let tiempoParalelo = 0;

function simularPeticion(nombre, tiempoMin = 500, tiempoMax = 2000, fallar = false) {
  return new Promise((resolve, reject) => {
    const tiempoDelay = Math.floor(Math.random() * (tiempoMax - tiempoMin + 1)) + tiempoMin;

    setTimeout(() => {
      if (fallar) {
        reject(new Error(`Error al cargar ${nombre}`));
      } else {
        resolve({
          nombre,
          tiempo: tiempoDelay,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, tiempoDelay);
  });
}

function formatearTiempo(ms) {
  return `${(ms / 1000).toFixed(2)}s`;
}

function mostrarLog(mensaje, tipo = 'info') {
  const item = document.createElement('div');
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  log.appendChild(item);
  log.scrollTop = log.scrollHeight;
}

async function cargarSecuencial() {
  mostrarLog('🔄 Iniciando carga secuencial...', 'info');
  resultados.classList.remove('visible');
  
  const inicio = performance.now();

  try {
    const usuario = await simularPeticion('Usuario', 500, 1000);
    mostrarLog(`✓ ${usuario.nombre} cargado en ${formatearTiempo(usuario.tiempo)}`, 'success');

    const posts = await simularPeticion('Posts', 700, 1500);
    mostrarLog(`✓ ${posts.nombre} cargados en ${formatearTiempo(posts.tiempo)}`, 'success');

    const comentarios = await simularPeticion('Comentarios', 600, 1200);
    mostrarLog(`✓ ${comentarios.nombre} cargados en ${formatearTiempo(comentarios.tiempo)}`, 'success');

    const fin = performance.now();
    const total = fin - inicio;
    tiempoSecuencial = total;

    mostrarLog(`✅ Secuencial completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();
  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }
}

async function cargarParalelo() {
  mostrarLog('🔄 Iniciando carga paralela...', 'info');
  resultados.classList.remove('visible');
  
  const inicio = performance.now();

  try {
    const promesas = [
      simularPeticion('Usuario', 500, 1000),
      simularPeticion('Posts', 700, 1500),
      simularPeticion('Comentarios', 600, 1200)
    ];

    const resultadosPromesas = await Promise.all(promesas);

    resultadosPromesas.forEach((resultado) => {
      mostrarLog(`✓ ${resultado.nombre} cargado en ${formatearTiempo(resultado.tiempo)}`, 'success');
    });

    const fin = performance.now();
    const total = fin - inicio;
    tiempoParalelo = total;

    mostrarLog(`✅ Paralelo completado en ${formatearTiempo(total)}`, 'success');
    mostrarComparativa();
  } catch (error) {
    mostrarLog(`❌ Error: ${error.message}`, 'error');
  }
}

function mostrarComparativa() {
  if (tiempoSecuencial > 0 && tiempoParalelo > 0) {
    const diferencia = tiempoSecuencial - tiempoParalelo;
    const porcentaje = ((diferencia / tiempoSecuencial) * 100).toFixed(1);

    resultados.innerHTML = `
      <h3>📊 Comparativa de Rendimiento</h3>
      <p><strong>Carga Secuencial:</strong> ${formatearTiempo(tiempoSecuencial)}</p>
      <p><strong>Carga Paralela:</strong> ${formatearTiempo(tiempoParalelo)}</p>
      <p><strong>Diferencia:</strong> ${formatearTiempo(diferencia)} (${porcentaje}% más rápido)</p>
    `;
    resultados.classList.add('visible');
  }
}

function limpiarLog() {
  log.innerHTML = '';
  resultados.classList.remove('visible');
  tiempoSecuencial = 0;
  tiempoParalelo = 0;
}

document.getElementById('btn-secuencial').addEventListener('click', cargarSecuencial);
document.getElementById('btn-paralelo').addEventListener('click', cargarParalelo);
document.getElementById('btn-limpiar').addEventListener('click', limpiarLog);

const inputTiempo = document.getElementById('input-tiempo');
const display = document.getElementById('display');
const barraProgreso = document.getElementById('barra-progreso');
const btnIniciar = document.getElementById('btn-iniciar');
const btnDetener = document.getElementById('btn-detener');
const btnReiniciar = document.getElementById('btn-reiniciar');

let intervaloId = null;
let tiempoRestante = 0;
let tiempoInicial = 0;

function formatearTiempoDisplay(segundos) {
  const mins = Math.floor(segundos / 60).toString().padStart(2, '0');
  const segs = (segundos % 60).toString().padStart(2, '0');
  return `${mins}:${segs}`;
}

function actualizarDisplay() {
  display.textContent = formatearTiempoDisplay(tiempoRestante);

  if (tiempoInicial > 0) {
    const porcentaje = ((tiempoInicial - tiempoRestante) / tiempoInicial) * 100;
    barraProgreso.style.width = `${porcentaje}%`;

    if (tiempoRestante <= 10 && tiempoRestante > 0) {
      display.classList.add('alerta');
      barraProgreso.classList.add('alerta');
    } else {
      display.classList.remove('alerta');
      barraProgreso.classList.remove('alerta');
    }
  }
}

function iniciar() {
  if (intervaloId) {
    return;
  }

  const tiempo = parseInt(inputTiempo.value);
  if (isNaN(tiempo) || tiempo <= 0) {
    alert('Ingresa un tiempo válido');
    return;
  }

  tiempoRestante = tiempo;
  tiempoInicial = tiempo;
  btnIniciar.disabled = true;
  btnDetener.disabled = false;
  inputTiempo.disabled = true;

  actualizarDisplay();

  intervaloId = setInterval(() => {
    tiempoRestante--;
    actualizarDisplay();

    if (tiempoRestante <= 0) {
      detener();
      display.classList.add('alerta');
      alert('⏰ ¡Tiempo terminado!');
    }
  }, 1000);
}

function detener() {
  if (intervaloId) {
    clearInterval(intervaloId);
    intervaloId = null;
    btnIniciar.disabled = false;
    btnDetener.disabled = true;
    inputTiempo.disabled = false;
  }
}

function reiniciar() {
  detener();

  tiempoRestante = 0;
  tiempoInicial = 0;
  display.textContent = '00:00';
  barraProgreso.style.width = '0%';
  display.classList.remove('alerta');
  barraProgreso.classList.remove('alerta');
}

btnIniciar.addEventListener('click', iniciar);
btnDetener.addEventListener('click', detener);
btnReiniciar.addEventListener('click', reiniciar);

btnDetener.disabled = true;


const logErrores = document.getElementById('log-errores');

function mostrarLogError(mensaje, tipo = 'info') {
  const item = document.createElement('div');
  item.className = `log-item log-${tipo}`;
  item.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
  logErrores.appendChild(item);
  logErrores.scrollTop = logErrores.scrollHeight;
}

async function simularError() {
  mostrarLogError('🔄 Intentando operación que fallará...', 'info');

  try {
    await simularPeticion('API', 500, 1000, true);
    mostrarLogError('✓ Operación exitosa', 'success');
  } catch (error) {
    
    mostrarLogError(`❌ Error capturado: ${error.message}`, 'error');
    mostrarLogError('ℹ️ El error fue manejado correctamente con try/catch', 'info');
  }
}

async function fetchConReintentos(nombre, intentos = 3) {
  mostrarLogError(`🔄 Iniciando ${intentos} intentos para cargar ${nombre}...`, 'info');

  for (let i = 0; i < intentos; i++) {
    try {
      mostrarLogError(`⏳ Intento ${i + 1}/${intentos}...`, 'info');
      
      const resultado = await simularPeticion(nombre, 500, 1000, Math.random() > 0.5);
      
      mostrarLogError(`✓ Éxito en intento ${i + 1}: ${nombre} cargado`, 'success');
      return resultado;
    } catch (error) {
      mostrarLogError(`❌ Intento ${i + 1} falló: ${error.message}`, 'error');
      
      if (i < intentos - 1) {
        const espera = Math.pow(2, i) * 500;
        mostrarLogError(`⏰ Esperando ${espera}ms antes del siguiente intento...`, 'warning');
        await new Promise(resolve => setTimeout(resolve, espera));
      }
    }
  }

  mostrarLogError(`💥 Todos los intentos fallaron para ${nombre}`, 'error');
  throw new Error(`No se pudo cargar ${nombre} después de ${intentos} intentos`);
}


document.getElementById('btn-error').addEventListener('click', simularError);
document.getElementById('btn-reintentos').addEventListener('click', () => {
  fetchConReintentos('Recurso', 3).catch(() => {
    mostrarLogError('ℹ️ Proceso de reintentos completado', 'info');
  });
});