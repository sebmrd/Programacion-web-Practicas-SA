'use strict';

/* =========================
   SELECCIÓN DE ELEMENTOS
========================= */

const formPost = document.querySelector('#form-post');
const inputPostId = document.querySelector('#post-id');
const inputTitulo = document.querySelector('#titulo');
const inputContenido = document.querySelector('#contenido');
const btnSubmit = document.querySelector('#btn-submit');
const btnCancelar = document.querySelector('#btn-cancelar');

const inputBuscar = document.querySelector('#input-buscar');
const btnBuscar = document.querySelector('#btn-buscar');
const btnLimpiar = document.querySelector('#btn-limpiar');

const listaPosts = document.querySelector('#lista-posts');
const mensajeEstado = document.querySelector('#mensaje-estado');
const contador = document.querySelector('#contador strong');

/* =========================
   ESTADO GLOBAL
========================= */

let posts = [];
let postsFiltrados = [];
let modoEdicion = false;

/* =========================
   FUNCIONES PRINCIPALES
========================= */

/**
 * Cargar todos los posts desde la API
 */
async function cargarPosts() {
  try {
    // TODO 6.2.1: Llamar a mostrarCargando() pasando listaPosts como parámetro
    mostrarCargando(listaPosts);

    // TODO 6.2.2: Llamar a ApiService.getPosts(20) y asignar el resultado a 'posts'
    posts = await ApiService.getPosts(20);

    // TODO 6.2.3: Copiar el array posts a postsFiltrados usando spread operator
    postsFiltrados = [...posts];

    // TODO 6.2.4: Llamar a renderizarPosts() pasando postsFiltrados y listaPosts
    renderizarPosts(postsFiltrados, listaPosts);

    // TODO 6.2.5: Llamar a actualizarContador()
    actualizarContador();

  } catch (error) {
    // Limpiar y mostrar error usando appendChild (no innerHTML)
    listaPosts.innerHTML = '';
    listaPosts.appendChild(MensajeError(`No se pudieron cargar los posts: ${error.message}`));
  }
}

/**
 * Actualizar el contador de posts
 */
function actualizarContador() {
  contador.textContent = postsFiltrados.length;
}

/**
 * Limpiar el formulario y resetear estado
 */
function limpiarFormulario() {
  formPost.reset();
  inputPostId.value = '';
  modoEdicion = false;
  btnSubmit.textContent = 'Crear Post';
  btnCancelar.style.display = 'none';
}

/**
 * Cambiar a modo edición
 * @param {object} post - Post a editar
 */
function activarModoEdicion(post) {
  modoEdicion = true;
  inputPostId.value = post.id;
  inputTitulo.value = post.title;
  inputContenido.value = post.body;
  btnSubmit.textContent = 'Actualizar Post';
  btnCancelar.style.display = 'inline-block';
  
  // Scroll al formulario
  formPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
  inputTitulo.focus();
}

/**
 * Crear o actualizar un post
 * @param {object} datosPost - Datos del post
 */
async function guardarPost(datosPost) {
  try {
    btnSubmit.disabled = true;
    btnSubmit.textContent = modoEdicion ? 'Actualizando...' : 'Creando...';

    let resultado;

    if (modoEdicion) {
      // TODO 7.1.1: Obtener el ID del input oculto y convertirlo a número
      const id = parseInt(inputPostId.value);

      // TODO 7.1.2: Llamar a ApiService.updatePost(id, datosPost) y guardar en resultado
      resultado = await ApiService.updatePost(id, datosPost);
      
      // Actualizar en el array local
      const index = posts.findIndex(p => p.id === id);
      if (index !== -1) {
        posts[index] = { ...resultado, id };
      }

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${id} actualizado correctamente`),
        3000
      );

    } else {
      // 1. Llamas a la API normalmente
      resultado = await ApiService.createPost(datosPost);
      
      // --- HACK PARA JSONPLACEHOLDER ---
      // Como la API siempre devuelve el ID 101, le asignamos un ID dinámico
      // buscando el ID más alto actual en tu array y sumándole 1.
      if (posts.length > 0) {
        // Encuentra el ID máximo actual y le suma 1 (ej: si el último es 20, este será 21)
        const idMaximo = Math.max(...posts.map(p => p.id));
        resultado.id = idMaximo + 1;
      } else {
        resultado.id = 1;
      }
    // ---------------------------------
    // 2. Agregas el resultado al INICIO del array
      posts.push(resultado);

      mostrarMensajeTemporal(
        mensajeEstado,
        MensajeExito(`Post #${resultado.id} creado correctamente`),
        3000
      );
    }

    // Re-renderizar
    postsFiltrados = [...posts];
    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();
    limpiarFormulario();

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al guardar: ${error.message}`),
      5000
    );
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = modoEdicion ? 'Actualizar Post' : 'Crear Post';
  }
}

/**
 * Eliminar un post
 * @param {number} id - ID del post a eliminar
 */
async function eliminarPost(id) {
  // TODO 7.2.1: Usar confirm() para pedir confirmación. Si retorna false, salir de la función
  if (!confirm(`¿Eliminar el post #${id}?`)) {
    return;
  }

  try {
    // TODO 7.2.2: Llamar a ApiService.deletePost(id) con await
    await ApiService.deletePost(id);

    // TODO 7.2.3: Filtrar el post eliminado del array posts
    posts = posts.filter(p => p.id !== id);

    // TODO 7.2.4: Filtrar el post eliminado del array postsFiltrados
    postsFiltrados = postsFiltrados.filter(p => p.id !== id);

    renderizarPosts(postsFiltrados, listaPosts);
    actualizarContador();

    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeExito(`Post #${id} eliminado correctamente`),
      3000
    );

  } catch (error) {
    mostrarMensajeTemporal(
      mensajeEstado,
      MensajeError(`Error al eliminar: ${error.message}`),
      5000
    );
  }
}

/**
 * Buscar posts por título o contenido
 * @param {string} termino - Término de búsqueda
 */
function buscarPosts(termino) {
  const terminoLower = termino.toLowerCase().trim();

  if (terminoLower === '') {
    // TODO 7.3.1: Si el término está vacío, copiar todos los posts a postsFiltrados
    postsFiltrados = [...posts];
  } else {
    // TODO 7.3.2: Filtrar posts donde el título O el body incluyan el término
    //   Usar .filter() y .includes() en las propiedades post.title y post.body
    postsFiltrados = posts.filter(post => {
        const tituloMatch = post.title.toLowerCase().includes(terminoLower);
        const bodyMatch = post.body.toLowerCase().includes(terminoLower);
        return tituloMatch || bodyMatch;
    });
  }

  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/**
 * Limpiar búsqueda
 */
function limpiarBusqueda() {
  inputBuscar.value = '';
  postsFiltrados = [...posts];
  renderizarPosts(postsFiltrados, listaPosts);
  actualizarContador();
}

/* =========================
   EVENT LISTENERS
========================= */

// Submit del formulario
formPost.addEventListener('submit', (e) => {
  e.preventDefault();

  const datosPost = {
    title: inputTitulo.value.trim(),
    body: inputContenido.value.trim(),
    userId: 1
  };

  guardarPost(datosPost);
});

// Cancelar edición
btnCancelar.addEventListener('click', () => {
  limpiarFormulario();
});

// Buscar posts
btnBuscar.addEventListener('click', () => {
  buscarPosts(inputBuscar.value);
});

// Buscar con Enter
inputBuscar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    buscarPosts(inputBuscar.value);
  }
});

// Limpiar búsqueda
btnLimpiar.addEventListener('click', () => {
  limpiarBusqueda();
});

// Delegación de eventos para editar y eliminar
listaPosts.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  
  if (!action) return;

  const id = parseInt(e.target.dataset.id);
  const post = posts.find(p => p.id === id);

  if (action === 'editar' && post) {
    activarModoEdicion(post);
  }

  if (action === 'eliminar') {
    eliminarPost(id);
  }
});

/* =========================
   INICIALIZACIÓN
========================= */

// Cargar posts al iniciar
cargarPosts();