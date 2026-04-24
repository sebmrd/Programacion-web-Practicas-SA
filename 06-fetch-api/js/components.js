'use strict';

/* =========================
   COMPONENTES
========================= */

/**
 * Componente para renderizar una tarjeta de post
 * Construye el elemento usando la API del DOM (createElement)
 * @param {object} post - Objeto con los datos del post
 * @returns {HTMLElement} - Elemento article del DOM
 */
function PostCard(post) {
  // Crear el contenedor principal
  const article = document.createElement('article');
  article.className = 'post-card fade-in';
  article.dataset.id = post.id;

  // Crear el header
  const header = document.createElement('div');
  header.className = 'post-card-header';

  const title = document.createElement('h3');
  title.className = 'post-card-title';
  title.textContent = post.title;

  const badge = document.createElement('span');
  badge.className = 'post-card-id';
  badge.textContent = `#${post.id}`;

  header.appendChild(title);
  header.appendChild(badge);

  // Crear el body
  const body = document.createElement('p');
  body.className = 'post-card-body';
  body.textContent = post.body;

  // Crear el footer con botones
  const footer = document.createElement('div');
  footer.className = 'post-card-footer';

  const btnEditar = document.createElement('button');
  btnEditar.className = 'btn-editar';
  btnEditar.textContent = 'Editar';
  btnEditar.dataset.action = 'editar';
  btnEditar.dataset.id = post.id;

  const btnEliminar = document.createElement('button');
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.dataset.action = 'eliminar';
  btnEliminar.dataset.id = post.id;

  footer.appendChild(btnEditar);
  footer.appendChild(btnEliminar);

  // Ensamblar el article
  article.appendChild(header);
  article.appendChild(body);
  article.appendChild(footer);

  return article;
};

/**
 * Componente de spinner de carga
 * @returns {HTMLElement} - Elemento div del DOM
 */
function Spinner() {
  // TODO 5.2.1: Crear un div con className 'loading'
  const container = document.createElement('div');
  container.className = 'loading';

  // TODO 5.2.2: Crear un div con className 'spinner' (el círculo animado)
  const spinner = document.createElement('div');
  spinner.className = 'spinner';

  // TODO 5.2.3: Crear un <p> con textContent 'Cargando posts...'
  const texto = document.createElement('p');
  texto.textContent = 'Cargando posts...';

  // TODO 5.2.4: Agregar spinner y texto al container con appendChild
  container.appendChild(spinner);
  container.appendChild(texto);

  // TODO 5.2.5: Retornar el container
  return container;
};

/**
 * Componente de mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeError(mensaje) {
  // TODO 5.3.1: Crear un div con className 'error'
  const container = document.createElement('div');
  container.className = 'error';

  // TODO 5.3.2: Crear un <strong> con textContent 'Error'
  const titulo = document.createElement('strong');
  titulo.textContent = 'Error';

  // TODO 5.3.3: Crear un <p> con textContent igual al parámetro mensaje
  const texto = document.createElement('p');
  texto.textContent = mensaje;

  // TODO 5.3.4: Agregar titulo y texto al container
  container.appendChild(titulo);
  container.appendChild(texto);

  // TODO 5.3.5: Retornar el container
  return container;
};

/**
 * Componente de mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 * @returns {HTMLElement} - Elemento div del DOM
 */
function MensajeExito(mensaje) {
  // TODO 5.3.6: Crear un div con className 'success'
  const container = document.createElement('div');
  container.className = 'success';

  // TODO 5.3.7: Crear un <p> con textContent igual al parámetro mensaje
  const texto = document.createElement('p');
  texto.textContent = mensaje;

  // TODO 5.3.8: Agregar texto al container y retornar
  container.appendChild(texto);
  return container;
};

/**
 * Componente de estado vacío
 * @returns {HTMLElement} - Elemento div del DOM
 */
function EstadoVacio() {
  const container = document.createElement('div');
  container.className = 'estado-vacio';

  const texto = document.createElement('p');
  texto.textContent = 'No hay posts para mostrar';

  container.appendChild(texto);

  return container;
};

/**
 * Limpiar contenedor y renderizar lista de posts
 * @param {array} posts - Array de posts a renderizar
 * @param {HTMLElement} contenedor - Elemento DOM donde renderizar
 */
function renderizarPosts(posts, contenedor) {
  // Limpiar contenedor
  contenedor.innerHTML = '';

  if (posts.length === 0) {
    contenedor.appendChild(EstadoVacio());
    return;
  }

  // Crear y agregar cada post
  posts.forEach(post => {
    const postElement = PostCard(post);
    contenedor.appendChild(postElement);
  });
};

/**
 * Mostrar spinner de carga
 * @param {HTMLElement} contenedor - Elemento DOM donde mostrar spinner
 */
function mostrarCargando(contenedor) {
  contenedor.innerHTML = '';
  contenedor.appendChild(Spinner());
};

/**
 * Mostrar mensaje temporal
 * @param {HTMLElement} contenedor - Elemento donde mostrar el mensaje
 * @param {HTMLElement} elemento - Elemento del mensaje (MensajeError o MensajeExito)
 * @param {number} duracion - Duración en ms (0 = no auto-ocultar)
 */
function mostrarMensajeTemporal(contenedor, elemento, duracion = 3000) {
  contenedor.innerHTML = '';
  contenedor.appendChild(elemento);
  contenedor.classList.remove('oculto');

  if (duracion > 0) {
    setTimeout(() => {
      contenedor.classList.add('oculto');
    }, duracion);
  }
};